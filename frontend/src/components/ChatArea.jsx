import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { useDispatch, useSelector } from 'react-redux'
import getMessages from '../features/getMessages'
import { setMessages } from '../Redux/messageSlice'

const ChatArea = () => {
  const [inputPrompt, setInputPrompt] = useState("")
  const { selectedConversation } = useSelector(state => state.conversation)
  const dispatch = useDispatch()
  useEffect(() => {
    const getMesg = async () => {

      if (!selectedConversation?._id) {
        dispatch(setMessages([]))
        return
      }
      try {
        const response = await getMessages({ conversationId: selectedConversation._id })
        const msgList = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : response?.messages || []
        dispatch(setMessages(msgList))
      } catch (error) {
        console.error('Failed to fetch messages:', error)
        dispatch(setMessages([]))
      }
    }

    getMesg()
  }, [selectedConversation?._id, dispatch])
  return (
    <div className='flex-1 h-screen flex flex-col justify-between bg-[#07090e] text-slate-100 min-w-0'>
      <Nav />
      <MessageList onSelectPrompt={(text) => setInputPrompt(text)} />
      <ChatInput inputPrompt={inputPrompt} setInputPrompt={setInputPrompt} />
    </div>
  )
}

export default ChatArea