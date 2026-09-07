import { PDFParse } from "pdf-parse";

/**
 * Extracts raw text from an uploaded PDF buffer.
 */
export const extractTextFromPDF = async (buffer) => {
    try {
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        if (typeof parser.destroy === "function") {
            await parser.destroy();
        }
        return result?.text || "";
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
};

/**
 * Splits text into overlapping chunks for semantic retrieval.
 */
export const chunkText = (text, chunkSize = 700, chunkOverlap = 100) => {
    const paragraphs = text.split(/\n\s*\n/);
    const chunks = [];
    let currentChunk = "";

    for (const para of paragraphs) {
        const trimmed = para.trim();
        if (!trimmed) continue;

        if ((currentChunk + " " + trimmed).length <= chunkSize) {
            currentChunk += (currentChunk ? "\n\n" : "") + trimmed;
        } else {
            if (currentChunk) {
                chunks.push(currentChunk);
                // Keep the end of currentChunk as overlap
                const words = currentChunk.split(" ");
                currentChunk = words.slice(-Math.floor(chunkOverlap / 6)).join(" ") + "\n\n" + trimmed;
            } else {
                // Large single paragraph, hard split
                for (let i = 0; i < trimmed.length; i += (chunkSize - chunkOverlap)) {
                    chunks.push(trimmed.slice(i, i + chunkSize));
                }
                currentChunk = "";
            }
        }
    }

    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
};
