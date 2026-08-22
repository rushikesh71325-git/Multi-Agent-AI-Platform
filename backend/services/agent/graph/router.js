import { getModel } from "../config/llmModels.js";
import { agent } from "../controllers/agent.controller.js";


export const router = async (state) => {
    if(state.agent && state.agent!=="auto"){
            return{
                ...state,
                agent:state.agent
            }
        
    }

    const llm = await getModel("router");
    const prompt = `
You are an agent router.

Available agents:

- chat
- search
- coding
- pdf
- ppt
- imageGen

Rules:

chat:
General conversation,
explanations,
learning,
questions.

search:
Current events,
latest information,
news,
recent developments,
internet lookup.

coding:
Generate code,
debug code,
build projects,
architecture,
API design.

pdf:
Questions about generate PDFs
or document context.

ppt:
Questions about generate ppts
or ppt context.

imageGen:
Generate images,
edit images,
analyze images,
describe image content,
extract text from images (OCR),
image transformations,
visual design,
logos,
posters,
illustrations,
diagrams,
thumbnails,
photo enhancement.

Return ONLY one word:

chat
search
coding
pdf
ppt
imageGen

User Query:
${state.prompt}
`;


    const response = await llm.invoke(prompt);
    console.log(response.content)
    return {
        ...state,
        agent: response.content.trim().toLowerCase()
    }

}