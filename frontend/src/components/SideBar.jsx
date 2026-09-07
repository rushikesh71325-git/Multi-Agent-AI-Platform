import React, { useState, useEffect } from 'react'
import { 
  PanelLeftIcon, 
  PanelRight, 
  PenBoxIcon, 
  Plus, 
  MessageSquare, 
  User, 
  Coins, 
  LogOut,
  Sparkles
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
    const { conversations = [], selectedConversation } = useSelector((state) => state.conversation || {})
    const userData = useSelector((state) => state.user?.userdata)

    const selectConversation = (conv) => {
        dispatch(setSelectedConversation(conv))
        if (conv?._id) {
            localStorage.setItem("selectedConversationId", conv._id)
        } else {
            localStorage.removeItem("selectedConversationId")
        }
    }

    useEffect(() => {
        const handleGetConversations = async () => {
            try {
                const response = await getConversation()
                const convList = Array.isArray(response) 
                    ? response 
                    : Array.isArray(response?.data) 
                        ? response.data 
                        : response?.data?.conversations || []
                
                dispatch(setConversations(convList))

                // Restore selected conversation on refresh
                if (convList.length > 0) {
                    const savedId = localStorage.getItem("selectedConversationId")
                    const currentSelected = convList.find(c => c._id === (selectedConversation?._id || savedId)) || convList[0]
                    if (currentSelected) {
                        dispatch(setSelectedConversation(currentSelected))
                        localStorage.setItem("selectedConversationId", currentSelected._id)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch conversations:", error)
                dispatch(setConversations([]))
            }
        }
        handleGetConversations()
    }, [userData, dispatch])

    const handleNewConversation = async () => {
        try {
            const response = await createConversation()
            const newConv = response?.data || response
            if (newConv) {
                dispatch(addConversation(newConv))
                selectConversation(newConv)
            }
        } catch (error) {
            console.error("Failed to create conversation:", error)
        }
    }

    if (collapsed) {
        return (
            <div className='hidden lg:flex flex-col items-center w-[60px] h-screen bg-[#090b10] border-r border-white/[0.06] py-4 gap-2 shrink-0 z-40'>
                <button 
                    type="button"
                    title="Expand Sidebar"
                    className='flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all bg-transparent border-none cursor-pointer'
                    onClick={() => setCollapsed(false)}
                >
                    <PanelRight size={17} />
                </button>

                <button
                    type="button"
                    title="New Chat"
                    className='flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20 hover:opacity-90 transition-all border-none cursor-pointer'
                    onClick={handleNewConversation}
                >
                    <Plus size={17} />
                </button>

                <div className='flex-1 overflow-y-auto px-2 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-2 w-full flex flex-col items-center gap-1.5'>
                    {(conversations || []).map((conv, index) => {
                        const isActive = selectedConversation?._id === conv?._id
                        return (
                            <button
                                key={conv?._id || conv?.id || `conv-collapsed-${index}`}
                                onClick={() => selectConversation(conv)}
                                title={conv?.title || "Chat"}
                                className={`flex items-center justify-center cursor-pointer p-2 rounded-xl border transition-all duration-150 ${
                                    isActive 
                                        ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]" 
                                        : "bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
                                }`}
                            >
                                <MessageSquare size={14} />
                            </button>
                        )
                    })}
                </div>

                {userData && (
                    <div className="shrink-0 mt-auto pt-2">
                        {userData?.avatar && !imageError ? (
                            <img
                                className='w-8 h-8 rounded-xl object-cover border border-indigo-500/40 shadow-sm'
                                src={userData?.avatar}
                                alt="avatar"
                                onError={() => setImageError(true)} 
                            />
                        ) : (
                            <div className='w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center text-slate-400'>
                                <User size={15} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="fixed lg:static inset-y-0 left-0 z-40 h-screen w-[275px] shrink-0 bg-[#090b10] border-r border-white/[0.06] transition-all duration-200 flex flex-col">
            {/* Header / Brand */}
            <div className='flex items-center justify-between px-4 py-4 border-b border-white/[0.06]'>
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                        <Sparkles size={14} />
                    </div>
                    <span className='text-[15px] font-bold text-white tracking-tight'>
                        Yug-Ai
                    </span>
                    <span className='text-[9.5px] font-semibold text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 px-1.5 py-0.2 rounded-full tracking-wider uppercase'>
                        v2 Pro
                    </span>
                </div>

                <button
                    type="button"
                    title="Collapse Sidebar"
                    className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-colors bg-transparent border-none cursor-pointer'
                    onClick={() => setCollapsed(true)}
                >
                    <PanelLeftIcon size={16} />
                </button>
            </div>

            {/* New Chat Button */}
            <div className='px-3 pt-3.5 pb-2'>
                <button
                    type="button"
                    onClick={handleNewConversation}
                    className='w-full flex items-center justify-center gap-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:opacity-95 shadow-[0_2px_12px_rgba(99,102,241,0.25)] rounded-xl py-2.5 border-none cursor-pointer transition-all duration-150'
                >
                    <Plus size={15} />
                    <span>New Conversation</span>
                </button>
            </div>

            {/* Recents Header */}
            <div className='px-4 pt-3 pb-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between'>
                <span>Recents</span>
                <span className="text-[10px] text-slate-600 font-mono">{conversations?.length || 0}</span>
            </div>

            {/* Conversation List */}
            <div className='flex-1 overflow-y-auto px-2.5 pb-2 space-y-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                {(conversations || []).map((conv, index) => {
                    const isActive = selectedConversation?._id === conv?._id
                    return (
                        <div
                            key={conv?._id || conv?.id || `conv-${index}`}
                            onClick={() => selectConversation(conv)}
                            className={`group flex items-center gap-2.5 cursor-pointer px-3 py-2.5 rounded-xl border transition-all duration-150 ${
                                isActive 
                                    ? "bg-indigo-500/15 border-indigo-500/30 text-white shadow-sm" 
                                    : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                            }`}
                        >
                            <MessageSquare 
                                size={14} 
                                className={`shrink-0 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} 
                            />
                            <span className="truncate text-xs font-medium flex-1">
                                {conv?.title || "New Chat"}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* User Profile Footer */}
            <div className='p-3 border-t border-white/[0.06] bg-black/20'>
                {userData ? (
                    <div className='flex items-center gap-2.5 rounded-xl p-2 hover:bg-white/[0.04] transition-colors'>
                        <div className="relative shrink-0">
                            {userData?.avatar && !imageError ? (
                                <img
                                    className='w-8 h-8 rounded-xl object-cover border border-indigo-500/30 shadow-sm'
                                    src={userData?.avatar}
                                    alt="avatar"
                                    onError={() => setImageError(true)} 
                                />
                            ) : (
                                <div className='w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center text-slate-400'>
                                    <User size={15} />
                                </div>
                            )}
                            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#090b10]" />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='text-xs font-semibold text-slate-200 truncate'>{userData?.name || "User"}</p>
                            <p className='text-[10px] text-indigo-400/90 font-medium'>Online</p>
                        </div>
                        <div className='flex items-center gap-1'>
                            <button 
                                type="button"
                                title="Log Out"
                                className='flex items-center justify-center w-7 h-7 rounded-lg border-none bg-transparent text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors' 
                                onClick={() => { logOut(); dispatch(setUserData(null)); }} 
                            >
                                <LogOut size={15} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button 
                        type="button" 
                        className='w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-200 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.09] rounded-xl py-2 cursor-pointer transition-all'
                    >
                        Login to Account
                    </button>
                )}
            </div>
        </div>
    )
}

export default SideBar