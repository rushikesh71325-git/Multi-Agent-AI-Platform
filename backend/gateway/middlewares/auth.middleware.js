import redis from "../../shared/redis/redis.js"
const protect = async (req, res, next) => {
    try {
        const sessionId = req.cookies?.session_id;
        if (!sessionId) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const user = await redis.get(`session:${sessionId}`)
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        req.user = JSON.parse(user)
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Authentication Error" })
    }

}

export default protect