import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import User from "../models/user.model.js";
import redis from "../../../shared/redis/redis.js";



export const login = async (req, res) => {



    try {
        const { token } = req.body
        const decoded = await getAuth(app).verifyIdToken(token)
        let user = await User.findOne({
            firebaseUid: decoded.uid,

        })
        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture,
            })
        }

        const sessionId = crypto.randomUUID();
        await redis.set(`session:${sessionId}`,JSON.stringify(user),"EX",60 * 60 * 24 * 7)
        res.cookie("session_id",sessionId,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:1000*60*60*24*7
        })
        
        return res.status(200).json({ message: "Login Successful", user })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Login Error ${error}" })
    }
}

export const logout = async (req,res)=>{
    try {
        const sessionId = req.cookies.session_id
        
        await redis.del(`session:${sessionId}`)
        
        res.clearCookie("session_id")
        return res.status(200).json({message:"Logout Successful"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Logout Error ${error}" })
    }
}