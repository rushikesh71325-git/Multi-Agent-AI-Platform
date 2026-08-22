
import api from "../../utils/axios.js"
async function sendMessage(payload){
    try {
        const {data} = await api.post("/api/agent/chat",payload)
        return data.me
    } catch (error) {
        console.log(error)
        return error
    }
}

export default sendMessage