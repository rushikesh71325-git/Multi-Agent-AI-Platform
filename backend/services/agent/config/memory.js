import redis from "../../../shared/redis/redis"
import { getMessages } from "../utils/getMessages"

export const getMemory = async (conversationId) => {
    const key = `memory-${conversationId}`
    const cached = await redis.get(key)
    if (cached) {
        return JSON.parse(cached)
    }
    const messages = await getMessages(conversationId)
    await redis.set(key, JSON.stringify(messages), "EX", 60 * 60 * 24)
    return messages

}

export const addMessage = async (conversationId, role, content) => {
    const key = `memory-${conversationId}`;
    const rewMessages = await redis.get(key)
    const messages = rewMessages ? JSON.parse(rewMessages) : []
    messages.push({ role, content })
    if (messages.length > 20) {
        messages.shift()
    }
    await redis.set(key, JSON.stringify(messages))
}