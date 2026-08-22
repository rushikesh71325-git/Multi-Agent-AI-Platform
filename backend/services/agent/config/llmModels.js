import { ChatGroq } from "@langchain/groq";

export const getModel = async (agent) => {
  // Lazily instantiate or ensure key availability
  const groq = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile", // Update to your target Groq model string
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