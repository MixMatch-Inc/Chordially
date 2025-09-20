'use client'

import MatchModal from '@/components/shared/MatchModal'
import SpotifyConnect from '@/components/shared/SpotifyConnect'
import SwipeDeck from '@/components/shared/SwipeDeck'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-4 md:p-8'>
      <MatchModal />
      <div className='w-full max-w-2xl text-center mb-8'>
        <h1 className='text-4xl font-bold'>Chordially</h1>
        {status === 'authenticated' && (
          <Link
            href='/chat'
            className='text-blue-500 hover:underline mt-4 inline-block'
          >
            Go to Chat
          </Link>
        )}
      </div>
      {status === 'authenticated' ? <SwipeDeck /> : <SpotifyConnect />}
    </main>
  )
}
