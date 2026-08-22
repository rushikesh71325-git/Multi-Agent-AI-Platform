import api from "../../utils/axios.js";

export const createConversation = async () => {
    try {
        const { data } = await api.get("/api/chat/create-conversation");

        console.log(data);

        return data;
    } catch (error) {
        console.log("Status:", error.response?.status);
        console.log("Backend error:", error.response?.data);
        console.log("Message:", error.message);

        throw error;
    }
};