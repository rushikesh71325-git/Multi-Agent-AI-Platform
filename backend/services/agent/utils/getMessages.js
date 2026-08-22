import axios from "axios";

export const getMessages = async(conversationId)=>{
    try{
        const res = await axios.get(`${process.env.CHAT_SERVICE}/get-messages/${conversationId}`);
        return res.data;
    }catch(err){
        console.log(err);
        return [];
    }

}