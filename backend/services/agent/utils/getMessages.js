import axios from "axios";

export const getMessages = async (conversationId) => {
    if (!conversationId || typeof conversationId !== "string" || conversationId.length !== 24) {
        return [];
    }
    try {
        const res = await axios.get(`${process.env.CHAT_SERVICE}/get-messages/${conversationId}`);
        return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
        return [];
    }
};