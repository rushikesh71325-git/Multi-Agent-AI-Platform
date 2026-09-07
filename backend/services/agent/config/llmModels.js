import { ChatGroq } from "@langchain/groq";

export const getModel = async (agent) => {
  // Lazily instantiate or ensure key availability
  const groq = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || "qwen/qwen3.8-27b",
    temperature: 0.7,
  });

  switch (agent) {
    case "chat":
      return groq;
    case "search":
      return groq;
    case "coding":
      return groq;
    default:
      return groq;
  }
};