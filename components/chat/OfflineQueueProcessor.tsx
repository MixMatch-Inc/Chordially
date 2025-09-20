'use client'

import { useAuthStore } from '@/stores/auth-store'
import { useIsOnline } from '@/hooks/useIsOnline'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

//
const postMessage = async (message: {
  matchId: string
  text: string
  tempId: string
}) => {
  const res = await fetch(`/api/matches/${message.matchId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message.text, tempId: message.tempId }),
  })
  if (!res.ok) throw new Error('Failed to send message')
  return res.json()
}

export default function OfflineQueueProcessor() {
  const isOnline = useIsOnline()
  const queryClient = useQueryClient()
  const { messageQueue, removeMessageFromQueue, updateMessageStatusInQueue } =
    useAuthStore()

  const mutation = useMutation({
    mutationFn: postMessage,
    onSuccess: (sentMessage) => {
      if (sentMessage.tempId) {
        removeMessageFromQueue(sentMessage.tempId)
      }
      queryClient.invalidateQueries({
        queryKey: ['messages', sentMessage.matchId],
      })
    },
    onError: (error, variables) => {
      console.error('Queue processor failed to send:', error)
      updateMessageStatusInQueue(variables.tempId, 'failed')
    },
  })

  useEffect(() => {
    if (isOnline && messageQueue.length > 0) {
      messageQueue.forEach((message) => {
        if (message.status === 'failed' && message.tempId) {
          updateMessageStatusInQueue(message.tempId, 'sending')
          mutation.mutate({
            matchId: message.matchId,
            text: message.text,
            tempId: message.tempId,
          })
        }
      })
    }
  }, [isOnline, messageQueue, mutation, updateMessageStatusInQueue])

  return null
}
