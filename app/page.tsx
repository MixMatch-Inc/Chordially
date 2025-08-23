'use client'

import { useQuery } from '@tanstack/react-query'
import type { PotentialMatchesResponse, UserProfile } from '@/lib/api-schema'
import { useAuthStore } from '@/stores/auth-store'

const fetchPotentialMatches = async (): Promise<UserProfile[]> => {
  const res = await fetch('/api/users/potential-matches')
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }
  const data: PotentialMatchesResponse = await res.json()
  return data.users
}

function UserProfileHeader() {
  const { user, isAuthenticated, logout } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <div className='text-center'>
        <p>Please log in to find your matches.</p>
      </div>
    )
  }

  return (
    <div className='text-center'>
      <p className='text-xl'>
        Welcome, <span className='font-bold'>{user?.name}!</span>
      </p>
      <button
        onClick={logout}
        className='mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm'
      >
        Logout
      </button>
    </div>
  )
}

function LoginButton() {
  const { login, isAuthenticated } = useAuthStore()

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', { method: 'POST' })
      const data = await res.json()
      login(data.user, data.token)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  if (isAuthenticated) return null

  return (
    <button
      onClick={handleLogin}
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
    >
      Log In with Mock User
    </button>
  )
}

export default function Home() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['potentialMatches'],
    queryFn: fetchPotentialMatches,
  })

  return (
    <main className='flex min-h-screen flex-col items-center p-12 md:p-24'>
      <div className='w-full max-w-2xl text-center'>
        <h1 className='text-4xl font-bold mb-4'>Chordially</h1>
        <UserProfileHeader />
        <div className='my-8'>
          <LoginButton />
        </div>
      </div>

      <div className='mt-8 p-4 border rounded-lg w-full max-w-2xl bg-gray-50 dark:bg-gray-800'>
        <h2 className='text-2xl font-semibold mb-4'>Swipe Deck (Mock Data)</h2>
        {isLoading && <p>Finding users...</p>}
        {isError && <p>Error: {error.message}</p>}
        {data && (
          <pre className='text-xs overflow-auto h-96'>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </main>
  )
}
