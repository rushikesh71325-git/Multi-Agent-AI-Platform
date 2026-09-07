import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import { qdrantClient, COLLECTION_NAME, inMemoryVectors } from "../config/qdrant.js";
import { getEmbedding, cosineSimilarity } from "../utils/embeddings.js";

export const pdfAgent = async (state) => {
    try {
        const query = state.prompt;
        const conversationId = state.conversationId;
        const queryVector = await getEmbedding(query);

        let retrievedChunks = [];

        // 1. Try Qdrant search/query first
        try {
            let searchResult = [];
            if (typeof qdrantClient.query === "function") {
                const res = await qdrantClient.query(COLLECTION_NAME, {
                    query: queryVector,
                    limit: 4,
                    filter: conversationId ? {
                        must: [{ key: "conversationId", match: { value: conversationId } }]
                    } : undefined,
                    with_payload: true,
                });
                searchResult = res?.points || res || [];
            } else if (typeof qdrantClient.search === "function") {
                searchResult = await qdrantClient.search(COLLECTION_NAME, {
                    vector: queryVector,
                    limit: 4,
                    filter: conversationId ? {
                        must: [{ key: "conversationId", match: { value: conversationId } }]
                    } : undefined,
                    with_payload: true,
                });
            }

            if (searchResult && searchResult.length > 0) {
                retrievedChunks = searchResult.map(r => r.payload?.text).filter(Boolean);
            }
        } catch (qdrantErr) {
            console.warn("Qdrant search fallback to in-memory store:", qdrantErr.message);
        }

        // 2. Fallback to in-memory vector store if Qdrant returned nothing
        if (retrievedChunks.length === 0 && inMemoryVectors.size > 0) {
            const allItems = Array.from(inMemoryVectors.values())
                .filter(item => !conversationId || item.conversationId === conversationId);

            const scored = allItems.map(item => ({
                ...item,
                score: cosineSimilarity(queryVector, item.vector),
            }));

            scored.sort((a, b) => b.score - a.score);
            retrievedChunks = scored.slice(0, 4).map(s => s.text);
        }

        const contextText = retrievedChunks.length > 0
            ? retrievedChunks.map((chunk, i) => `[Excerpt ${i + 1}]:\n${chunk}`).join("\n\n---\n\n")
            : "No uploaded PDF document found for this conversation. Please upload a PDF document first using the attachment button.";

        const llm = await getModel("chat");
        const systemPrompt = `
You are an expert Document Analysis & PDF AI Assistant.
Answer the user's question using the provided PDF document excerpts.

Rules:
1. Ground your answer strictly in the excerpts below.
2. If the answer cannot be found in the context, clearly explain that the uploaded document does not contain that information.
3. Cite relevant excerpt numbers where appropriate (e.g. "[Excerpt 1]").
4. Use clean, readable Markdown formatting.

DOCUMENT CONTEXT:
${contextText}
`;

        const response = await llm.invoke([
            new SystemMessage(systemPrompt),
            new HumanMessage(query)
        ]);

        return {
            ...state,
            aiResponse: response.content || response.text,
            pdfContext: retrievedChunks,
        };
    } catch (error) {
        console.error("PDF Agent Error:", error);
        return {
            ...state,
            aiResponse: `Error analyzing document: ${error.message}. Please verify your PDF is uploaded and try again.`,
        };
    }
};