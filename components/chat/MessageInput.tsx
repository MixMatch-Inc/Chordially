'use client'

import type { Message } from '@/lib/api-schema'
import { useAuthStore } from '@/stores/auth-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

const postMessage = async ({
  matchId,
  text,
  tempId,
}: {
  matchId: string
  text: string
  tempId: string
}) => {
  const res = await fetch(`/api/matches/${matchId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, tempId }),
  })
  if (!res.ok) throw new Error('Failed to send message')
  return res.json()
}

export default function MessageInput({ matchId }: { matchId: string }) {
  const [text, setText] = useState('')
  const queryClient = useQueryClient()
  const { addMessageToQueue, removeMessageFromQueue } = useAuthStore()

  const mutation = useMutation({
    mutationFn: postMessage,
    onSuccess: (newMessage) => {
      if (newMessage.tempId) {
        removeMessageFromQueue(newMessage.tempId)
      }

      queryClient.invalidateQueries({ queryKey: ['messages', matchId] })
    },
    onError: (error, variables) => {
      console.error('Message failed to send:', error)

      const failedMessage: Message = {
        id: variables.tempId,
        tempId: variables.tempId,
        matchId: variables.matchId,
        senderId: 'me',
        text: variables.text,
        timestamp: new Date().toISOString(),
      }
      addMessageToQueue(failedMessage)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    const tempId = crypto.randomUUID()

    queryClient.setQueryData(
      ['messages', matchId],
      (oldData: Message[] | undefined) => {
        const optimisticMessage: Message = {
          id: tempId,
          tempId,
          matchId,
          senderId: 'me',
          text,
          timestamp: new Date().toISOString(),
          status: 'sending',
        }
        return oldData ? [...oldData, optimisticMessage] : [optimisticMessage]
      }
    )

    mutation.mutate({ matchId, text, tempId })
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className='flex'>
      <input
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Type a message...'
        className='flex-1 p-2 rounded-l-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600'
      />
      <button type='submit' className='bg-blue-500 text-white p-2 rounded-r-lg'>
        Send
      </button>
    </form>
  )
}
