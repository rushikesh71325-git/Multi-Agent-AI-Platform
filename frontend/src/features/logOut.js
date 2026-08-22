import api from "../../utils/axios";

async function logOut() {
    try {
        const { data } = await api.get("/api/auth/logout")
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

export default logOut

