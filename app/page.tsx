import SpotifyConnect from '@/components/shared/SpotifyConnect'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center p-12 md:p-24'>
      <div className='w-full max-w-2xl text-center'>
        <h1 className='text-4xl font-bold mb-8'>Chordially</h1>
        <SpotifyConnect />
      </div>
    </main>
  )
}
