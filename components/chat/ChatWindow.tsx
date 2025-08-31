'use client'

import type { Message } from '@/lib/api-schema'
import { useAuthStore } from '@/stores/auth-store'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

const fetchMessages = async (matchId: string): Promise<Message[]> => {
  const res = await fetch(`/api/matches/${matchId}/messages`)
  if (!res.ok) throw new Error('Failed to fetch messages')
  return res.json()
}

export default function ChatWindow() {
  const { selectedMatchId } = useAuthStore()
  const messageQueue = useAuthStore((state) => state.messageQueue)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', selectedMatchId],
    queryFn: () => fetchMessages(selectedMatchId!),
    enabled: !!selectedMatchId,
    refetchInterval: 3000,
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, messageQueue])

  if (!selectedMatchId) {
    return (
      <div className='flex items-center justify-center h-full text-gray-500'>
        Select a conversation to start chatting
      </div>
    )
  }

  if (isLoading)
    return (
      <div className='flex items-center justify-center h-full'>
        Loading messages...
      </div>
    )

  // Combine messages from the server and any pending messages from the offline queue
  const allMessages = [
    ...(messages || []),
    ...messageQueue.filter((m) => m.matchId === selectedMatchId),
  ].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1 p-4 overflow-y-auto'>
        {allMessages.map((msg) => (
          <MessageBubble key={msg.id || msg.tempId} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
        <MessageInput matchId={selectedMatchId} />
      </div>
    </div>
  )
}
