import { StateGraph } from "@langchain/langgraph";
import {router} from "../graph/router.js"
import {chatAgent} from "../agents/chat.agent.js";
import {searchAgent} from "../agents/search.agent.js";
import {pdfAgent} from "../agents/pdf.agent.js";
import {pptAgent} from "../agents/ppt.agent.js";
import {iamgeGenAgent} from "../agents/imageGen.agent.js";
import {codingAgent} from "../agents/coding.agent.js";
import {agentState} from "./state.js";

const workflow = new StateGraph(agentState)

workflow.addNode("router",router)
workflow.addNode("chat",chatAgent)
workflow.addNode("search",searchAgent)
workflow.addNode("pdf",pdfAgent)
workflow.addNode("ppt",pptAgent)
workflow.addNode("imageGen",iamgeGenAgent)
workflow.addNode("coding",codingAgent)

workflow.addEdge("__start__","router")
workflow.addConditionalEdges("router", (state) => {
    const agent = (state.agent || "").toLowerCase().trim();
    switch (agent) {
      case "chat":
        return "chat";
      case "search":
      case "websearch":
        return "search";
      case "pdf":
        return "pdf";
      case "ppt":
      case "presentation":
        return "ppt";
      case "imagegen":
      case "image":
      case "images":
        return "imageGen";
      case "coding":
      case "code":
        return "coding";
      default:
        return "chat";
    }
}, {
    chat:"chat",
    search:"search",
    pdf:"pdf",
    ppt:"ppt",
    imageGen:"imageGen",
    coding:"coding",
    
})

workflow.addEdge("search","chat")
workflow.addEdge("chat","__end__")
workflow.addEdge("pdf","__end__")
workflow.addEdge("ppt","__end__")
workflow.addEdge("imageGen","__end__")
workflow.addEdge("coding","__end__")

export const graph = workflow.compile()