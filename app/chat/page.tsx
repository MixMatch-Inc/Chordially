'use client'

import ChatWindow from '@/components/chat/ChatWindow'
import ConversationList from '@/components/chat/ConversationList'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import OfflineQueueProcessor from '@/components/chat/OfflineQueueProcessor'

export default function ChatPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/')
    },
  })

  if (status === 'loading') {
    return (
      <div className='flex items-center justify-center h-screen'>
        Loading...
      </div>
    )
  }

  return (
    <>
      <OfflineQueueProcessor />
      <div className='flex h-screen bg-gray-100 dark:bg-gray-900'>
        <div className='w-1/3 border-r border-gray-200 dark:border-gray-700'>
          <ConversationList />
        </div>
        <div className='w-2/3'>
          <ChatWindow />
        </div>
      </div>
    </>
  )
}
