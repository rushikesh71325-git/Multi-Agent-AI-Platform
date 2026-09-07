import { Router } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { agent, streamAgent } from "../controllers/agent.controller.js";
import { extractTextFromPDF, chunkText } from "../utils/pdfParser.js";
import { getEmbedding } from "../utils/embeddings.js";
import { qdrantClient, COLLECTION_NAME, inMemoryVectors } from "../config/qdrant.js";

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

router.post("/chat", agent);
router.post("/stream", streamAgent);

router.get("/download-ppt/:fileName", (req, res) => {
    const filePath = path.join(process.cwd(), "public", "presentations", req.params.fileName);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
    }
    return res.download(filePath);
});

// PDF Upload & RAG Indexing Endpoint
router.post("/upload-pdf", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "No PDF file uploaded" });
        }

        const conversationId = req.body.conversationId;
        const fileName = req.file.originalname;

        console.log(`Processing uploaded PDF: "${fileName}" for conversation "${conversationId}"`);

        // 1. Extract raw text from PDF buffer
        const rawText = await extractTextFromPDF(req.file.buffer);
        if (!rawText.trim()) {
            return res.status(400).json({ success: false, error: "PDF is empty or contains only scanned images without OCR text." });
        }

        // 2. Chunk text
        const chunks = chunkText(rawText, 700, 100);
        console.log(`Extracted ${rawText.length} characters into ${chunks.length} chunks.`);

        // 3. Generate embeddings and save to vector store
        const points = [];
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const vector = await getEmbedding(chunk);
            const pointId = Math.floor(Math.random() * 1000000000);

            // In-memory fallback indexing
            inMemoryVectors.set(`${conversationId}_${i}`, {
                id: pointId,
                conversationId,
                text: chunk,
                fileName,
                vector,
                chunkIndex: i,
            });

            points.push({
                id: pointId,
                vector,
                payload: {
                    conversationId,
                    fileName,
                    text: chunk,
                    chunkIndex: i,
                },
            });
        }

        // 4. Index into Qdrant collection if connected
        try {
            await qdrantClient.upsert(COLLECTION_NAME, {
                wait: true,
                points,
            });
            console.log(`Successfully indexed ${points.length} chunks into Qdrant collection "${COLLECTION_NAME}".`);
        } catch (qdrantErr) {
            console.warn("Qdrant upsert notice (fallback to in-memory store active):", qdrantErr.message);
        }

        return res.status(200).json({
            success: true,
            message: `Successfully processed "${fileName}" and indexed ${chunks.length} knowledge chunks.`,
            fileName,
            totalChunks: chunks.length,
        });
    } catch (error) {
        console.error("PDF Processing Error:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "Failed to process PDF document",
        });
    }
});

export default router;