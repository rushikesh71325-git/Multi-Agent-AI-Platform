import React, { useEffect } from 'react'
import Nav from './Nav'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { useDispatch, useSelector } from 'react-redux'
import getMessages from '../features/getMessages'
import { setMessages } from '../Redux/messageSlice'

const ChatArea = () => {
  const { selectedConversation } = useSelector(state => state.conversation)
  const dispatch = useDispatch()
  useEffect(() => {
    const getMesg = async () => {

      if (!selectedConversation?._id) return
      if (selectedConversation?.title == "New Chat") {
        return;
      }
      try {
        const response = await getMessages({ conversationId: selectedConversation._id })
        // Safe access with fallback
        dispatch(setMessages(response?.data?.messages || []))
      } catch (error) {
        console.error('Failed to fetch messages:', error)
        dispatch(setMessages([])) // Reset state cleanly on error
      }
    }

    getMesg()
  }, [selectedConversation?._id, dispatch])
  return (
    <div className='flex-1 h-screen flex flex-col justify-between bg-[#0d0f14] text-white min-w-0'>
      <Nav />
      <MessageList />
      <ChatInput />
    </div>
  )
}

export default ChatArea