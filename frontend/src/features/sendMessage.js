
import api from "../../utils/axios.js"
async function sendMessage(payload) {
    try {
        const { data } = await api.post("/api/agent/chat", payload)
        return data
    } catch (error) {
        console.error("Failed to send message:", error)
        throw error
    }
}

export default sendMessage