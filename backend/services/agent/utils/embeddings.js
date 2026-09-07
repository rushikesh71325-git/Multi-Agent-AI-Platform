import axios from "axios";
import { VECTOR_DIMENSION } from "../config/qdrant.js";

/**
 * Generates normalized 384-dimensional embeddings.
 * Uses HuggingFace API if key is provided; otherwise uses deterministic semantic feature hashing with L2 normalization.
 */
export const getEmbedding = async (text) => {
    const cleanText = text.replace(/\s+/g, " ").trim();

    if (process.env.HUGGINGFACE_API_KEY) {
        try {
            const res = await axios.post(
                "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
                { inputs: cleanText },
                {
                    headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
                    timeout: 5000,
                }
            );
            if (Array.isArray(res.data) && typeof res.data[0] === "number") {
                return res.data;
            }
        } catch (e) {
            console.warn("HuggingFace embedding fallback:", e.message);
        }
    }

    // High-performance deterministic n-gram vectorizer with L2 normalization
    const vector = new Array(VECTOR_DIMENSION).fill(0);
    const words = cleanText.toLowerCase().split(/[^a-z0-9]+/);

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (!word) continue;

        // Hash unigrams
        let hash1 = 0;
        for (let j = 0; j < word.length; j++) {
            hash1 = (hash1 * 31 + word.charCodeAt(j)) % VECTOR_DIMENSION;
        }
        vector[Math.abs(hash1)] += 1.0;

        // Hash bigrams for semantic context
        if (i < words.length - 1) {
            const bigram = `${word}_${words[i + 1]}`;
            let hash2 = 0;
            for (let j = 0; j < bigram.length; j++) {
                hash2 = (hash2 * 37 + bigram.charCodeAt(j)) % VECTOR_DIMENSION;
            }
            vector[Math.abs(hash2)] += 1.5;
        }
    }

    // L2 Normalize
    let norm = 0;
    for (let i = 0; i < VECTOR_DIMENSION; i++) {
        norm += vector[i] * vector[i];
    }
    norm = Math.sqrt(norm) || 1.0;

    for (let i = 0; i < VECTOR_DIMENSION; i++) {
        vector[i] = vector[i] / norm;
    }

    return vector;
};

export const cosineSimilarity = (vecA, vecB) => {
    let dot = 0;
    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
    }
    return dot;
};
