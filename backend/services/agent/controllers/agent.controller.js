import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";

export const agent = async (req, res) => {
    try {
        const { prompt, conversationId, agent } = req.body;

        await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
            conversationId,
            role: "user",
            content: prompt,
        });
        console.log("Routing request with agent:", agent);
        const result = await graph.invoke({
            prompt,
            conversationId,
            agent,
        });

        const response = result.aiResponse;
        if (response) {
            await addMessage(conversationId, "user", prompt);
            await addMessage(conversationId, "assistant", response);
            await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
                conversationId,
                role: "assistant",
                content: response,
                images: result.images || [],
            });
        }

        return res.status(200).json({
            success: true,
            data: response,
            images: result.images || [],
            artifact: result.artifact || null,
            message: "Response generated successfully",
        });
    } catch (err) {
        console.error("Agent Controller Error:", err?.response?.data || err?.message || err);
        return res.status(500).json({
            success: false,
            error: err?.message || "internal server error",
            details: err?.response?.data,
        });
    }
};

export const streamAgent = async (req, res) => {
    const { prompt, conversationId, agent } = req.body;

    // Set Server-Sent Events headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    if (res.flushHeaders) res.flushHeaders();

    try {
        // Save initial user message
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
            conversationId,
            role: "user",
            content: prompt,
        });

        let fullContent = "";
        let result = null;

        // Try streaming events from LangGraph
        try {
            const eventStream = graph.streamEvents(
                { prompt, conversationId, agent },
                { version: "v2" }
            );

            for await (const event of eventStream) {
                if (event.event === "on_chat_model_stream") {
                    const token = event.data?.chunk?.content || "";
                    if (token) {
                        fullContent += token;
                        res.write(`data: ${JSON.stringify({ type: "token", token })}\n\n`);
                    }
                }
            }
        } catch (streamErr) {
            console.warn("Graph streamEvents fallback:", streamErr.message);
        }

        // Finalize state via invoke if stream didn't capture artifacts/images
        result = await graph.invoke({
            prompt,
            conversationId,
            agent,
        });

        const finalResponse = result.aiResponse || fullContent;

        if (finalResponse) {
            await addMessage(conversationId, "user", prompt);
            await addMessage(conversationId, "assistant", finalResponse);
            await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
                conversationId,
                role: "assistant",
                content: finalResponse,
                images: result.images || [],
            });
        }

        res.write(`data: ${JSON.stringify({
            type: "done",
            data: finalResponse,
            images: result.images || [],
            artifact: result.artifact || null,
        })}\n\n`);

        res.end();
    } catch (error) {
        console.error("Streaming Error:", error);
        res.write(`data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`);
        res.end();
    }
};