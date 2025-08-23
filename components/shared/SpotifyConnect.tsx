'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function SpotifyConnect() {
  const { data: session, status } = useSession()
  const [topArtists, setTopArtists] = useState<unknown[] | null>(null)

  useEffect(() => {
    const getTopArtists = async () => {
      //@ts-expect-error ???
      if (session?.accessToken) {
        const response = await fetch(
          'https://api.spotify.com/v1/me/top/artists',
          {
            headers: {
              //@ts-expect-error ???
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        )
        const data = await response.json()
        setTopArtists(data.items)
      }
    }
    getTopArtists()
  }, [session])

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (session) {
    return (
      <div className='w-full text-center'>
        <p className='mb-4'>Signed in as {session.user?.email}</p>
        <button
          onClick={() => signOut()}
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
        >
          Sign out
        </button>
        <div className='mt-8 p-4 border rounded-lg w-full max-w-2xl bg-gray-50 dark:bg-gray-800 mx-auto'>
          <h2 className='text-2xl font-semibold mb-4'>Your Top 5 Artists:</h2>
          {topArtists ? (
            <ul>
              {topArtists.slice(0, 5).map((artist) => (
                <li key={artist.id} className='mb-2'>
                  {artist.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading artists...</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='text-center'>
      <p className='mb-4'>Connect your Spotify to begin.</p>
      <button
        onClick={() => signIn('spotify')}
        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
      >
        Connect to Spotify
      </button>
    </div>
  )
}
