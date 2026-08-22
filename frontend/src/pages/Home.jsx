import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, googleProvider } from '../../utils/firebase'
import api from '../../utils/axios'
import { FcGoogle } from "react-icons/fc";
import { useSelector } from 'react-redux';
import SideBar from '../components/SideBar';
import ChatArea from '../components/ChatArea';
import Artifact from '../components/Artifact';
 
const Home = () => {
  const userdata = useSelector((state) => state.user.userdata)
  console.log(userdata)
  const handleLogin = async (token) => {
    const { data } = await api.post("/api/auth/login", { token })
    console.log(data)
  }

  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider)
    const token = await result.user.getIdToken()
    await handleLogin(token)
  }

  return (
<div className="h-screen flex bg-[#0d0f14] text-white overflow-hidden">
  <SideBar/>
  <ChatArea/>
  <Artifact/>

  {!userdata && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
      <div className="flex flex-col items-center w-full max-w-80 rounded-xl px-6 py-8 border border-slate-700 bg-slate-900 text-white text-sm">
        <h2 className="text-xl font-semibold text-center">Welcome to Saksham-Ai</h2>
        <p className="text-slate-300 mt-1">Login to your account</p>
        
        <button
          type="button"
          onClick={googleLogin}
          className="w-full mt-10 px-4 py-2.5 flex items-center justify-center gap-2 font-medium text-black bg-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          <FcGoogle size={18} />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  )}
</div>
  )
}

export default Home


