import React from 'react'
import MessageBubble from './MessageBubble'
import { useSelector } from 'react-redux'
import { Sparkles, Code2, Presentation, Image as ImageIcon, Globe, FileText, ArrowUpRight } from 'lucide-react'

function MessageList({ onSelectPrompt }) {
    const { selectedConversation } = useSelector(state => state.conversation || {})
    const { messages = [] } = useSelector(state => state.message || {})

    const promptCards = [
        {
            title: "Generate Visual Artwork",
            prompt: "A majestic tiger head logo, stylized geometric lines, vibrant orange and neon blue rim light, 8k vector",
            agent: "imageGen",
            icon: ImageIcon,
            gradient: "from-fuchsia-500/20 to-pink-500/5",
            border: "border-fuchsia-500/20 hover:border-fuchsia-500/40",
            iconColor: "text-fuchsia-400",
        },
        {
            title: "Build Executive Deck",
            prompt: "Create an executive 5-slide pitch deck on AI-Powered Green Energy Solutions",
            agent: "ppt",
            icon: Presentation,
            gradient: "from-purple-500/20 to-indigo-500/5",
            border: "border-purple-500/20 hover:border-purple-500/40",
            iconColor: "text-purple-400",
        },
        {
            title: "Interactive Web App",
            prompt: "Build an interactive stopwatch with lap counter in HTML, CSS and JavaScript",
            agent: "coding",
            icon: Code2,
            gradient: "from-emerald-500/20 to-teal-500/5",
            border: "border-emerald-500/20 hover:border-emerald-500/40",
            iconColor: "text-emerald-400",
        },
        {
            title: "Live Web Research",
            prompt: "What are the latest breakthroughs and developments in quantum computing this year?",
            agent: "search",
            icon: Globe,
            gradient: "from-sky-500/20 to-blue-500/5",
            border: "border-sky-500/20 hover:border-sky-500/40",
            iconColor: "text-sky-400",
        },
    ];

    return (
        <div className='flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {messages.length === 0 || !selectedConversation ? (
                <div className="min-h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-8">
                    {/* Glowing AI Orb */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse pointer-events-none" />
                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center text-indigo-300 shadow-2xl backdrop-blur-md">
                            <Sparkles size={28} />
                        </div>
                    </div>

                    <div className='flex flex-col gap-2 mb-8'>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                            What would you like to build?
                        </h1>
                        <p className="text-sm md:text-base text-slate-400 max-w-md mx-auto">
                            Harness specialized agents for high-res images, executive presentations, coding artifacts, and live search.
                        </p>
                    </div>

                    {/* Starter Action Cards */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left'>
                        {promptCards.map((card, i) => {
                            const Icon = card.icon;
                            return (
                                <button 
                                    key={i}
                                    type="button"
                                    onClick={() => onSelectPrompt && onSelectPrompt(card.prompt)}
                                    className={`group flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-br ${card.gradient} border ${card.border} hover:bg-white/[0.05] transition-all duration-200 cursor-pointer text-left backdrop-blur-sm`}
                                >
                                    <div className="flex items-center justify-between w-full mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg bg-white/[0.06] ${card.iconColor}`}>
                                                <Icon size={16} />
                                            </div>
                                            <span className="text-xs font-semibold text-slate-200">{card.title}</span>
                                        </div>
                                        <ArrowUpRight size={14} className="text-slate-500 group-hover:text-white transition-colors" />
                                    </div>
                                    <p className="text-[12px] text-slate-400 line-clamp-2 leading-relaxed">
                                        "{card.prompt}"
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className='space-y-6 max-w-4xl mx-auto w-full'>
                    {messages.map((msg, i) => (
                        <div key={msg?._id || `msg-${i}`} className="transition-opacity duration-200">
                            <MessageBubble role={msg?.role} content={msg?.content} images={msg?.images || []} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MessageList
