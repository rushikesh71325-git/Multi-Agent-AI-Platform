
import api from "../../utils/axios"

async function getMessages({conversationId}) {
    try {
        const { data } = await api.get(`/api/chat/get-messages/${conversationId}`);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
  
}

export default getMessages