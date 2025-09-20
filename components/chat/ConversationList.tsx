'use client'

import type { Match } from '@/lib/api-schema'
import { useAuthStore } from '@/stores/auth-store'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'

const fetchMatches = async (): Promise<Match[]> => {
  const res = await fetch('/api/matches')
  if (!res.ok) throw new Error('Failed to fetch matches')
  return res.json()
}

export default function ConversationList() {
  const { data: matches, isLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
  })
  const { selectedMatchId, selectMatch } = useAuthStore()

  if (isLoading) return <div>Loading conversations...</div>

  return (
    <div className='h-full overflow-y-auto'>
      <h2 className='p-4 text-xl font-bold border-b border-gray-200 dark:border-gray-700'>
        Matches
      </h2>
      <ul>
        {matches?.map((match) => (
          <li
            key={match.id}
            onClick={() => selectMatch(match.id)}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 ${selectedMatchId === match.id ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
          >
            <Image
              src={match.user.avatarUrl}
              alt={match.user.name}
              width={50}
              height={50}
              className='rounded-full'
            />
            <div className='ml-4'>
              <p className='font-semibold'>{match.user.name}</p>
              <p className='text-sm text-gray-500'>Start chatting...</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
