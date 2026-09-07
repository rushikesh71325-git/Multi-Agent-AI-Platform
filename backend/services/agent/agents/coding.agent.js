import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";

export const codingAgent = async (state) => {
    const llm = await getModel("coding");
    const history = (await getMemory(state.conversationId)) || [];
    const systemPrompt = `
You are an expert software engineer and coding assistant.
Provide high quality, clean, and complete code with explanations.
Always format code using markdown code blocks with the appropriate language identifier.
`;
    const messages = [new SystemMessage(systemPrompt)];
    history.forEach(message => {
        if (!message || !message.content) return;
        if (message.role === "user") {
            messages.push(new HumanMessage(message.content));
        } else {
            messages.push(new AIMessage(message.content));
        }
    });
    messages.push(new HumanMessage(state.prompt));
    const response = await llm.invoke(messages);
    const text = response.content || response.text || "";

    // Extract the primary code block for artifact preview
    let artifact = null;
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    let match;
    let largestCode = "";
    let codeLanguage = "javascript";

    while ((match = codeBlockRegex.exec(text)) !== null) {
        const lang = (match[1] || "text").toLowerCase();
        const code = match[2].trim();
        if (code.length > largestCode.length) {
            largestCode = code;
            codeLanguage = lang;
        }
    }

    if (largestCode) {
        const isWeb = ["html", "svg", "htm"].includes(codeLanguage) || 
                      largestCode.includes("<!DOCTYPE") || 
                      largestCode.includes("<html");
        
        artifact = {
            type: isWeb ? "web" : "code",
            title: isWeb ? "Interactive Web Preview" : `${codeLanguage.toUpperCase()} Code Solution`,
            language: codeLanguage,
            content: largestCode,
        };
    }

    return {
        ...state,
        aiResponse: text,
        artifact,
    };
};