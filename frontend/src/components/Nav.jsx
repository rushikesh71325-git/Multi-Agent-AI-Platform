import React from 'react'
import { MessageSquare, Layout, Sparkles, Cpu } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleArtifact } from '../Redux/artifactSlice'

function Nav() {
    const dispatch = useDispatch()
    const { selectedConversation } = useSelector(state => state.conversation || {})
    const { messages = [] } = useSelector(state => state.message || {})
    const { artifact, isOpen } = useSelector(state => state.artifact || {})

    if (!selectedConversation) return null

    return (
        <div className='h-14 flex items-center justify-between px-4 md:px-6 border-b border-white/[0.06] bg-[#0b0d13]/80 backdrop-blur-xl shrink-0 z-20'>
            {/* Left: Chat Title & Status */}
            <div className='flex items-center gap-3 min-w-0'>
                <div className='relative flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shrink-0 text-indigo-400'>
                    <MessageSquare size={14} />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0b0d13]" />
                </div>
                <div className='min-w-0'>
                    <h2 className='text-[13.5px] font-bold text-slate-100 tracking-tight truncate'>
                        {selectedConversation?.title || "New Chat"}
                    </h2>
                </div>
                <div className='hidden sm:flex items-center gap-1.5 text-[10.5px] font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] px-2.5 py-0.5 rounded-full shrink-0'>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <span>{messages?.length || 0} messages</span>
                </div>
            </div>

            {/* Right: Model Info & Artifact Toggle */}
            <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-slate-400">
                    <Cpu size={12} className="text-cyan-400" />
                    <span>GPT-120B High-Speed</span>
                </div>

                {artifact && (
                    <button
                        onClick={() => dispatch(toggleArtifact())}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                            isOpen
                                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                                : 'bg-white/[0.04] text-slate-300 border-white/[0.09] hover:bg-white/[0.08] hover:text-white'
                        }`}
                    >
                        <Layout size={14} className={isOpen ? 'text-indigo-400' : 'text-slate-400'} />
                        <span>{isOpen ? 'Hide Artifact' : 'View Artifact'}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    </button>
                )}
            </div>
        </div>
    )
}

export default Nav