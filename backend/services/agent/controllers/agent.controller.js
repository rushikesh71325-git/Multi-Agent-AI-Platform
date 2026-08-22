import axios from "axios"
import {graph} from "../graph/graph.js"
import { addMessage } from "../config/memory.js";

export const agent = async (req, res) => {
    try{
        const {prompt,conversationId,agent} = req.body;
        
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
            conversationId,
            role:"user",
            content:prompt
        });
        console.log("agent",agent);
        const result = await graph.invoke({
            prompt,
            conversationId,
            agent
        });
        const response = result.aiResponse
        await addMessage(conversationId,"user",prompt)
        await addMessage(conversationId,"assistant",response)
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
            conversationId,
            role:"assistant",
            content:response,
            images:result.images,
        });
        return res.status(200).json({
            success:true,
            data:response,
            images:result.images,
            message:"Response generated successfully"
        })


    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            error:"internal server error"
        })
    }
    
}