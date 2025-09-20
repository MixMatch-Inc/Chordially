'use client'

import AuthManager from '@/components/AuthManager'
import MatchModal from '@/components/shared/MatchModal'
import SwipeDeck from '@/components/shared/SwipeDeck'
import FandomMatchModal from '@/components/web3/FandomMatchModal'
import { useAuthStore } from '@/stores/auth-store'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  const { isAuthenticated } = useAuthStore()
  const { data: session } = useSession()

  const isLoggedIn = isAuthenticated || session?.user

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-4 md:p-8'>
      <FandomMatchModal />
      <MatchModal />
      <div className='w-full max-w-2xl text-center mb-8'>
        <h1 className='text-4xl font-bold'>Chordially</h1>
        {isLoggedIn && (
          <Link
            href='/chat'
            className='text-blue-500 hover:underline mt-4 inline-block'
          >
            Go to Chat
          </Link>
        )}
      </div>
      {isLoggedIn ? <SwipeDeck /> : <AuthManager />}
    </main>
  )
}
