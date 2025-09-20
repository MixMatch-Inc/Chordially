import type { UserProfile } from '@/lib/api-schema'
import Image from 'next/image'

interface MusicCardProps {
  user: UserProfile
}

export default function MusicCard({ user }: MusicCardProps) {
  return (
    <div className='relative h-full w-full rounded-2xl shadow-2xl overflow-hidden'>
      <Image
        src={user.avatarUrl}
        alt={user.name}
        fill
        className='object-cover'
        priority
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20' />
      <div className='absolute bottom-0 left-0 p-6 text-white'>
        <h2 className='text-3xl font-bold'>
          {user.name}, {user.age}
        </h2>
        <p className='mt-2 text-lg font-semibold'>Anthem:</p>
        <p className='text-md'>
          {user.musicProfile.anthem.title} - {user.musicProfile.anthem.artist}
        </p>
      </div>
    </div>
  )
}
