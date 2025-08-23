'use client'

import { useState } from 'react'
import type { UserProfile } from '@/lib/api-schema'

export default function Home() {
  const [data, setData] = useState<UserProfile[] | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users/potential-matches')
      const json = await res.json()
      setData(json.users)
    } catch (error) {
      console.error('Failed to fetch mock data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <h1 className='text-4xl font-bold mb-8'>Chordially Dev Home</h1>

      <button
        onClick={fetchData}
        disabled={loading}
        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400'
      >
        {loading ? 'Loading...' : 'Fetch Mock User Data'}
      </button>

      {data && (
        <div className='mt-8 p-4 border rounded-lg w-full max-w-2xl bg-gray-50 dark:bg-gray-800'>
          <h2 className='text-2xl font-semibold mb-4'>Mock Data Received:</h2>
          <pre className='text-xs overflow-auto'>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </main>
  )
}
