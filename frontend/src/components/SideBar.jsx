import React, { useState, useEffect } from 'react'
import { 
  PanelLeftIcon, 
  PanelRight, 
  PenBoxIcon, 
  Plus, 
  MessageSquare, 
  User, 
  Coins, 
  LogOut 
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { setConversations, setSelectedConversation, addConversation } from "../Redux/conversationSlice"
import { setUserData } from "../Redux/userSlice"
import { getConversation } from "../features/getConversation"
import { createConversation } from "../features/createConversation"
import logOut from '../features/logOut'

function SideBar() {
    const [collapsed, setCollapsed] = useState(false)
    const [imageError, setImageError] = useState(false)
    const dispatch = useDispatch()
    const { conversations = [], selectedConversation } = useSelector((state) => state.conversation)
    const { userData } = useSelector((state) => state.user)
    console.log("USER DATA:", userData)

    useEffect(() => {
        const handleGetConversations = async () => {
            try {
                const response = await getConversation()
                // Safely extract array response whether response is data array or nested in data.conversations
                const convList = Array.isArray(response?.data) 
                    ? response.data 
                    : response?.data?.conversations || []
                
                dispatch(setConversations(convList))
            } catch (error) {
                console.error("Failed to fetch conversations:", error)
                dispatch(setConversations([]))
            }
        }
        handleGetConversations()
    }, [userData, dispatch])

    const handleConversations = async () => {
        try {
            const response = await createConversation()
            // Ensure payload is an object
            const newConv = response?.data || response
            if (newConv) {
                dispatch(addConversation(newConv))
                dispatch(setSelectedConversation(newConv))
            }
        } catch (error) {
            console.error("Failed to create conversation:", error)
        }
    }

    if (collapsed) {
        return (
            <div className='hidden lg:flex flex-col items-center w-[56px] h-screen bg-[#0d0f14] border-r border-white/[0.06] py-4 gap-1 shrink-0'>
                <button 
                    type="button"
                    className='flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1'
                    onClick={() => setCollapsed(false)}
                >
                    <PanelRight size={16} />
                </button>

                <button
                    type="button"
                    className='flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer'
                    onClick={handleConversations}
                >
                    <Plus size={17} />
                </button>

                <div className='flex-1 overflow-y-auto px-2 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-2 w-full flex flex-col items-center gap-1'>
                    {(conversations || []).map((conv, index) => {
                        const isActive = selectedConversation?._id === conv?._id
                        return (
                            <div
                                key={conv?._id || conv?.id || `conv-collapsed-${index}`}
                                onClick={() => dispatch(setSelectedConversation(conv))}
                                className={`flex items-center justify-center cursor-pointer p-2 rounded-[10px] border transition-colors duration-150 ${isActive ? "bg-indigo-500/10 border-indigo-500/[0.18]" : "bg-transparent border-transparent"}`}
                            >
                                <div className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150 ${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-white/[0.05] text-slate-500"}`}>
                                    <MessageSquare size={13} />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {userData && (
                    <div className="shrink-0 mt-auto pt-2">
                        {userData?.avatar && !imageError ? (
                            <img
                                className='w-8 h-8 rounded-[10px] object-cover border border-indigo-500/25'
                                src={userData?.avatar}
                                alt="avatar"
                                onError={() => setImageError(true)} 
                            />
                        ) : (
                            <div className='w-8 h-8 rounded-[10px] bg-white/[0.06] flex items-center justify-center'>
                                <User size={15} className="text-slate-400" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={`fixed lg:static inset-y-0 left-0 z-50 h-screen shrink-0 bg-[#0d0f14] border-r border-white/[0.06] transition-all duration-200 ${collapsed ? 'w-[70px]' : 'w-[270px]'}`}>
            <div className='flex flex-col h-full'>
                {/* Header */}
                <div className='flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]'>
                    <button
                        type="button"
                        className='hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer'
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <PanelLeftIcon size={16} />
                    </button>

                    {!collapsed && (
                        <>
                            <span className='text-[16px] font-semibold text-slate-100 tracking-tight flex-1'>
                                Yug-Ai
                            </span>
                            <span className='text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide'>
                                free
                            </span>
                            <button
                                type="button"
                                className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer'
                                onClick={()=>dispatch(setSelectedConversation(null))}
                            >
                                <PenBoxIcon size={14} />
                            </button>
                        </>
                    )}
                </div>

                {/* New Chat Button Area */}
                <div className='px-3 pt-4 pb-1'>
                    <button
                        type="button"
                        className={`w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-700 rounded-xl py-2.5 border-none cursor-pointer hover:opacity-90 transition-opacity duration-150 ${collapsed ? 'px-0' : 'px-4'}`}
                        onClick={()=>dispatch(setSelectedConversation(null))}
                    >
                        <Plus size={16} />
                        {!collapsed && <span>New Chat</span>}
                    </button>
                </div>

                {/* Recents Label */}
                {!collapsed && (
                    <div className='px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600'>
                        {conversations?.length === 0 ? "No Recent Conversations" : "Recents"}
                    </div>
                )}

                {/* Conversation List */}
                <div className='flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                    {(conversations || []).map((conv, index) => {
                        const isActive = selectedConversation?._id === conv?._id
                        return (
                            <div
                                key={conv?._id || conv?.id || `conv-expanded-${index}`}
                                onClick={() => dispatch(setSelectedConversation(null))}
                                className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 ${isActive ? "bg-indigo-500/10 border-indigo-500/[0.18]" : "bg-transparent border-transparent"}`}
                            >
                                <div className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150 ${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-white/[0.05] text-slate-500"}`}>
                                    <MessageSquare size={13} />
                                </div>
                                {!collapsed && (
                                    <span className="truncate text-sm text-slate-300">
                                        {conv?.title || "New Chat"}
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className='mx-2.5 h-px bg-white/[0.06]' />
                
                {/* User Profile Footer */}
                <div className='px-3.5 py-3.5'>
                    {userData ? (
                        <div className='flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/[0.05] transition-colors duration-150'>
                            <div className="relative shrink-0">
                                {userData?.avatar && !imageError ? (
                                    <img
                                        className='w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25'
                                        src={userData?.avatar}
                                        alt="avatar"
                                        onError={() => setImageError(true)} 
                                    />
                                ) : (
                                    <div className='w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center'>
                                        <User size={15} className="text-slate-400" />
                                    </div>
                                )}
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-[13.5px] font-semibold text-slate-100 truncate'>{userData?.name || "User"}</p>
                                <p className='text-[11px] text-slate-600 mt-px'>Free Plan</p>
                            </div>
                            <div className='flex gap-1'>
                                <button type="button" className='flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150'>
                                    <Coins size={16} />
                                </button>
                                <button 
                                    type="button"
                                    className='flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-slate-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150' 
                                    onClick={() => { logOut(); dispatch(setUserData(null)); }} 
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button type="button" className='w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-200 bg-white/[0.05] border border-white/[0.08] rounded-xl py-[11px] cursor-pointer hover:bg-white/[0.08] transition-colors duration-150'>
                            Login
                        </button>
                    )}
                </div>

            </div>
        </div>
    )
}

export default SideBar