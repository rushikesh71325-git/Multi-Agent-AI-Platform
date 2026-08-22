const getCurrentUser = async(req,res)=>{
    try{
        const user = req.user
        return res.status(200).json({user})
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Error"})
    }
}


export { getCurrentUser }