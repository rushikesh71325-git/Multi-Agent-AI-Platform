import React from 'react'
import MessageBubble from './MessageBubble'
import { useSelector } from 'react-redux'
function MessageList() {
    const { selectedConversation } = useSelector(state => state.conversation)
    const { messages } = useSelector(state => state.message)
    return (
        <div className='flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>

            {messages.length == 0 || !selectedConversation ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                    <div className='flex flex-col gap-1.5'>
                        <h1 className="text-4xl font-bold mb-2">Yug-AI</h1>
                        <p className="text-lg text-gray-400">How can I help you today?</p>
                    </div>
                    <div className='flex flex-wrap justify-center gap-2 mt-1'>
                        {["Write a Netflix clone", "Explain Redis", "Build a dashboard"].map((s) => (
                            <button className='text-[12px] text-slate-400 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer'>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            ) :
                <div className='space-y-5'>
                    {messages?.map((msg,i)=>(
                        <div>
                            <MessageBubble role={msg?.role} content={msg?.content} images={msg.images || []} />
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default MessageList
