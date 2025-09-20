'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import type { UserProfile } from '@/lib/api-schema'
import ProfileForm from '@/components/profile/ProfileForm'
import ContractDemo from '@/components/web3/ContractDemo'

const fetchProfile = async (): Promise<UserProfile> => {
  const res = await fetch('/api/profile')
  if (!res.ok) throw new Error('Failed to fetch profile')
  return res.json()
}

export default function ProfilePage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/')
    },
  })

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  })

  if (status === 'loading' || isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        Loading Profile...
      </div>
    )
  }

  return (
    <main className='container mx-auto max-w-2xl py-12'>
      <div>
        <h1 className='text-3xl font-bold mb-8'>Edit Your Profile</h1>
        {profile && <ProfileForm profile={profile} />}
      </div>

      <div>
        <h2 className='text-2xl font-bold mb-4'>Web3 Contract Interaction</h2>
        <ContractDemo />
      </div>
    </main>
  )
}
