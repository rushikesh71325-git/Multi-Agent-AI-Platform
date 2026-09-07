import React, { useState, useRef } from 'react'
import { 
    Paperclip, 
    Mic, 
    Send, 
    Zap, 
    MessageSquare, 
    Code2, 
    FileText, 
    Presentation, 
    Image as ImageIcon, 
    Globe, 
    Loader2,
    Sparkles 
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import sendMessage from '../features/sendMessage'
import { addMessage } from '../Redux/messageSlice'
import { setArtifact } from '../Redux/artifactSlice'
import { createConversation } from "../features/createConversation"
import { updateConversation } from "../features/updateConversation"
import { addConversation, setSelectedConversation, setConversationTitle } from '../Redux/conversationSlice'
import api from '../../utils/axios.js'

function ChatInput({ inputPrompt = "", setInputPrompt }) {
    const [value, setValue] = useState("")
    const [selectedAgent, setSelectedAgent] = useState("auto")
    const [isUploading, setIsUploading] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const fileInputRef = useRef(null)
    const textareaRef = useRef(null)
    const dispatch = useDispatch()
    const { selectedConversation } = useSelector(state => state.conversation || {})
    const { messages = [] } = useSelector(state => state.message || {})

    React.useEffect(() => {
        if (inputPrompt) {
            setValue(inputPrompt)
            if (setInputPrompt) setInputPrompt("")
            if (textareaRef.current) {
                textareaRef.current.focus()
            }
        }
    }, [inputPrompt, setInputPrompt])

    const ensureConversation = async () => {
        let conversation = selectedConversation
        if (!conversation) {
            const conv = await createConversation()
            dispatch(setSelectedConversation(conv))
            dispatch(addConversation(conv))
            if (conv?._id) localStorage.setItem("selectedConversationId", conv._id)
            conversation = conv
        }
        return conversation
    }

    const handleSendMessage = async () => {
        if (isSending || value.trim() === "") return
        const conversation = await ensureConversation()

        if (conversation?.title === "New Chat" && value.trim()) {
            await updateConversation({ id: conversation._id, title: value.trim() })
            dispatch(setConversationTitle({ title: value.trim(), conversationId: conversation._id }))
        }

        const userText = value.trim()
        const agentName = selectedAgent === "imageGen" ? "imageGen" : selectedAgent.toLowerCase()
        const payload = { conversationId: conversation._id, prompt: userText, agent: agentName }
        dispatch(addMessage({ role: "user", content: userText }))
        setValue("")
        setIsSending(true)

        try {
            const res = await sendMessage(payload)
            if (res?.data) {
                dispatch(addMessage({ role: "assistant", content: res.data, images: res.images || [] }))
            }
            if (res?.artifact) {
                dispatch(setArtifact(res.artifact))
            }
        } catch (err) {
            console.error("Error sending message:", err)
        } finally {
            setIsSending(false)
        }
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.name.toLowerCase().endsWith(".pdf")) {
            alert("Please select a PDF document.")
            return
        }

        const conversation = await ensureConversation()
        setIsUploading(true)
        dispatch(addMessage({ role: "user", content: `📎 Uploaded Document: **${file.name}**` }))

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("conversationId", conversation._id)

            const res = await api.post("/api/agent/upload-pdf", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            dispatch(addMessage({
                role: "assistant",
                content: `✅ **${file.name}** has been processed and indexed into the vector database (${res.data?.totalChunks || 0} knowledge chunks).\n\nI have switched to the **PDF Agent**. Ask me any question about your document!`
            }))
            setSelectedAgent("pdf")
        } catch (err) {
            console.error("PDF upload error:", err)
            dispatch(addMessage({
                role: "assistant",
                content: `❌ Failed to process **${file.name}**: ${err?.response?.data?.error || err.message}`
            }))
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    const agents = [
        {
            id: "auto",
            icon: Zap,
            label: "Auto",
            activeGradient: "from-amber-500 to-orange-600",
            glow: "shadow-[0_0_14px_rgba(245,158,11,0.35)]",
            border: "border-amber-500/40",
            accentText: "Smart Routing",
        },
        {
            id: "chat",
            icon: MessageSquare,
            label: "Chat",
            activeGradient: "from-indigo-500 to-violet-600",
            glow: "shadow-[0_0_14px_rgba(99,102,241,0.35)]",
            border: "border-indigo-500/40",
            accentText: "General AI",
        },
        {
            id: "coding",
            icon: Code2,
            label: "Coding",
            activeGradient: "from-emerald-500 to-teal-600",
            glow: "shadow-[0_0_14px_rgba(16,185,129,0.35)]",
            border: "border-emerald-500/40",
            accentText: "Live Artifacts",
        },
        {
            id: "pdf",
            icon: FileText,
            label: "PDF",
            activeGradient: "from-rose-500 to-pink-600",
            glow: "shadow-[0_0_14px_rgba(244,63,94,0.35)]",
            border: "border-rose-500/40",
            accentText: "RAG & Citations",
        },
        {
            id: "ppt",
            icon: Presentation,
            label: "PPT",
            activeGradient: "from-purple-500 to-indigo-600",
            glow: "shadow-[0_0_14px_rgba(168,85,247,0.35)]",
            border: "border-purple-500/40",
            accentText: "Executive Slides",
        },
        {
            id: "imageGen",
            icon: ImageIcon,
            label: "Image",
            activeGradient: "from-fuchsia-500 to-pink-600",
            glow: "shadow-[0_0_14px_rgba(217,70,239,0.35)]",
            border: "border-fuchsia-500/40",
            accentText: "1024px Art",
        },
        {
            id: "search",
            icon: Globe,
            label: "Search",
            activeGradient: "from-sky-500 to-blue-600",
            glow: "shadow-[0_0_14px_rgba(14,165,233,0.35)]",
            border: "border-sky-500/40",
            accentText: "Live Web",
        },
    ]

    const activeAgentObj = agents.find(a => a.id === selectedAgent) || agents[0]

    return (
        <div className='w-full overflow-hidden px-3 md:px-6 py-4 border-t border-white/[0.06] bg-[#0b0d13]/90 backdrop-blur-xl'>
            <div className='flex flex-col gap-2.5 bg-white/[0.025] hover:bg-white/[0.035] focus-within:bg-white/[0.04] border border-white/[0.08] focus-within:border-indigo-500/40 focus-within:shadow-[0_0_24px_rgba(99,102,241,0.12)] rounded-2xl px-4 pt-3.5 pb-3 transition-all duration-200'>
                
                {/* Agent Selection Chips */}
                <div className='flex items-center justify-between gap-2 flex-wrap'>
                    <div className='flex items-center gap-1.5 flex-wrap'>
                        {agents.map((agent) => {
                            const isActive = selectedAgent === agent.id;
                            const Icon = agent.icon;
                            return (
                                <button
                                    type="button"
                                    key={agent.id}
                                    onClick={() => setSelectedAgent(agent.id)}
                                    className={`
                                        flex-shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
                                        ${isActive
                                            ? `bg-gradient-to-r ${agent.activeGradient} text-white border-transparent ${agent.glow}`
                                            : "bg-white/[0.03] text-slate-400 border-white/[0.07] hover:border-white/[0.15] hover:text-slate-200 hover:bg-white/[0.06]"
                                        }
                                    `}
                                >
                                    <Icon size={13} className={isActive ? "text-white" : "text-slate-400"} />
                                    <span>{agent.label}</span>
                                    {isActive && agent.accentText && (
                                        <span className="hidden sm:inline-block text-[9.5px] bg-black/25 px-1.5 py-0.2 rounded-full font-medium tracking-tight">
                                            {agent.accentText}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <Sparkles size={12} className="text-indigo-400" />
                        <span>Mode: <strong className="text-slate-300 font-semibold">{activeAgentObj.label}</strong></span>
                    </div>
                </div>

                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    placeholder={`Ask ${activeAgentObj.label} Agent anything... (e.g. ${
                        selectedAgent === 'imageGen' ? 'Cyberpunk tiger logo with neon rim light' :
                        selectedAgent === 'ppt' ? 'Pitch deck on AI Renewable Energy' :
                        selectedAgent === 'coding' ? 'Build a sleek interactive counter widget in HTML' :
                        selectedAgent === 'pdf' ? 'Summarize key findings in the uploaded document' :
                        selectedAgent === 'search' ? 'Latest news and updates on tech breakthroughs' :
                        'Ask anything...'
                    })`}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    value={value}
                    className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-500/80 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50 mt-1 min-h-[58px]"
                    rows={2}
                />

                {/* Footer Controls */}
                <div className='flex items-center justify-between pt-1 border-t border-white/[0.04]'>
                    <div className='flex items-center gap-1.5'>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept=".pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <button 
                            type="button"
                            disabled={isUploading}
                            onClick={() => fileInputRef.current?.click()}
                            title="Upload PDF Document (RAG Indexing)"
                            className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all bg-transparent cursor-pointer disabled:opacity-50'
                        >
                            {isUploading ? <Loader2 size={16} className="animate-spin text-indigo-400" /> : <Paperclip size={16} />}
                        </button>
                        <button 
                            type="button"
                            title="Voice input"
                            className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all bg-transparent cursor-pointer'
                        >
                            <Mic size={16} />
                        </button>

                        <span className="hidden md:inline-block text-[10.5px] text-slate-500 font-medium ml-2">
                            Press <kbd className="bg-white/[0.06] border border-white/[0.1] px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono">↵</kbd> to send • <kbd className="bg-white/[0.06] border border-white/[0.1] px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono">⇧ + ↵</kbd> for line
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={!value.trim() || isSending}
                            onClick={handleSendMessage}
                            title="Send Message"
                            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border-none cursor-pointer transition-all duration-200 ${
                                value.trim() && !isSending 
                                    ? "bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-95 text-white shadow-[0_2px_12px_rgba(99,102,241,0.35)] scale-[1.02]" 
                                    : "bg-white/[0.05] text-slate-500 cursor-not-allowed"
                            }`}
                        >
                            {isSending ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <>
                                    <span>Send</span>
                                    <Send size={13} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ChatInput