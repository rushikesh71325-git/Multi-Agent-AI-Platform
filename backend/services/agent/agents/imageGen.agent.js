import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";

export const iamgeGenAgent = async (state) => {
    try {
        const llm = await getModel("chat");

        // Enhance user's prompt into an artistic, photorealistic prompt
        const enhancementPrompt = `
You are an expert prompt engineer for Midjourney and FLUX.
Transform the user's concept into a vivid, visually breathtaking image prompt.
Include:
- Core visual subject in crisp detail
- Environment, atmosphere, and background elements
- Lighting (e.g. volumetric lighting, golden hour, neon rim light, soft shadows)
- Art direction (e.g. photorealistic 8k, Unreal Engine 5 render, cinematic photography, shallow depth of field)

CRITICAL RULES:
- Output ONLY the prompt string.
- NO introductory text (like "Here is the prompt:").
- NO quotation marks or conversational commentary.
- Maximum 50 words.

Concept: ${state.prompt}
`;

        let refinedPrompt = state.prompt;
        try {
            const enhancementResponse = await llm.invoke([
                new SystemMessage("You are an expert AI prompt engineer. Output strictly the refined visual prompt with no fluff."),
                new HumanMessage(enhancementPrompt)
            ]);
            const text = (enhancementResponse.content || "").replace(/["'\n]/g, " ").trim();
            if (text && text.length > 5) {
                refinedPrompt = text.slice(0, 300);
            }
        } catch (llmErr) {
            console.warn("Prompt enhancement fallback:", llmErr.message);
        }

        // Clean prompt for URL query
        const cleanPrompt = refinedPrompt.replace(/[^\w\s,-]/g, " ").replace(/\s+/g, " ").trim();

        // 2 distinct stylistic seeds and angles
        const seed = Math.floor(Math.random() * 899999 + 100000);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;

        const aiResponse = `### 🎨 AI Generated Artwork for: "${state.prompt}"

Here is your generated visual:

> **Artistic Direction:** *${cleanPrompt}*

*Click on the artwork to expand, view full resolution, or download directly.*`;

        return {
            ...state,
            aiResponse,
            images: [imageUrl],
        };
    } catch (error) {
        console.error("Image Generation Error:", error);
        return {
            ...state,
            aiResponse: `Failed to generate image: ${error.message || "Unknown error"}. Please try again with a descriptive topic.`,
            images: [],
        };
    }
};