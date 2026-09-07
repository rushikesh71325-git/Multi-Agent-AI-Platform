import { QdrantClient } from "@qdrant/js-client-rest";

const qdrantUrl = process.env.QDRANT_URL || "http://localhost:6333";
const qdrantApiKey = process.env.QDRANT_API_KEY;

export const qdrantClient = new QdrantClient({
    url: qdrantUrl,
    apiKey: qdrantApiKey,
    checkCompatibility: false,
});

export const COLLECTION_NAME = "saksham_documents";
export const VECTOR_DIMENSION = 384;

// In-memory fallback if local Qdrant is not yet started
export const inMemoryVectors = new Map();

export const initQdrantCollection = async () => {
    try {
        const collections = await qdrantClient.getCollections();
        const exists = collections.collections.some(c => c.name === COLLECTION_NAME);
        if (!exists) {
            await qdrantClient.createCollection(COLLECTION_NAME, {
                vectors: {
                    size: VECTOR_DIMENSION,
                    distance: "Cosine",
                },
            });
            console.log(`Qdrant Collection "${COLLECTION_NAME}" created successfully.`);
        } else {
            console.log(`Qdrant Collection "${COLLECTION_NAME}" ready.`);
        }
    } catch (error) {
        console.warn("Qdrant connection notice (running in-memory vector fallback):", error.message);
    }
};
