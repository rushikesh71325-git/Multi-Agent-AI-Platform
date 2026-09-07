import { searchTool } from "../config/tavily.js";

export const searchAgent = async (state) => {
    try {
        const results = await searchTool.invoke({ query: state.prompt });
        const images = Array.isArray(results?.images) ? results.images : [];
        return {
            ...state,
            searchResults: results,
            images: images,
        };
    } catch (err) {
        console.error("Search Agent Error:", err?.message || err);
        return {
            ...state,
            searchResults: [],
            images: [],
        };
    }
};