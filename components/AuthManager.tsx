'use client'

import { useAuthStore } from '@/stores/auth-store'
import { useAccount } from 'wagmi'
import SpotifyConnect from '../shared/SpotifyConnect'
import ConnectWalletButton from './ConnectWalletButton'
import SignInWithFlareButton from './SignInWithFlareButton'

export default function AuthManager() {
  const { isAuthenticated } = useAuthStore()
  const { isConnected } = useAccount()

  if (isAuthenticated) {
    return null // Don't show anything if the user is already logged in
  }

  return (
    <div className='flex flex-col items-center gap-4 p-8 border rounded-lg'>
      <h2 className='text-xl font-semibold'>Choose Your Login Method</h2>
      <div className='flex items-center gap-4'>
        {/* Web3 Login Flow */}
        <div className='flex flex-col items-center gap-2'>
          <ConnectWalletButton />
          {isConnected && <SignInWithFlareButton />}
        </div>

        <div className='self-stretch border-l mx-4'></div>

        {/* Web2 Login Flow */}
        <SpotifyConnect />
      </div>
    </div>
  )
}
