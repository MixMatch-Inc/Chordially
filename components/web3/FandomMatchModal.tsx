'use client'

import { proofOfFandomContract } from '@/lib/abi/contracts'
import { useAuthStore } from '@/stores/auth-store'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

export default function FandomMatchModal() {
  const {
    isFandomModalOpen,
    matchedUser,
    compatibilityDetails,
    closeFandomModal,
  } = useAuthStore()

  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const handleMint = () => {
    writeContract({
      ...proofOfFandomContract,
      functionName: 'mint',
      args: [],
    })
  }

  const getButtonText = () => {
    if (isConfirming) return 'Minting...'
    if (isPending) return 'Check Wallet...'
    if (isConfirmed) return 'Minted Successfully!'
    return "Mint 'Proof of Fandom' Badge"
  }

  return (
    <AnimatePresence>
      {isFandomModalOpen && matchedUser && compatibilityDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4'
          onClick={closeFandomModal}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className='bg-gradient-to-br from-blue-600 to-indigo-800 p-6 rounded-2xl text-white text-center shadow-2xl w-full max-w-md'
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className='text-4xl font-bold'>Fandom Match!</h1>
            <p className='text-lg my-4'>
              You and {matchedUser.name} both love{' '}
              <span className='font-bold'>
                {compatibilityDetails.artist.overlap[0]}
              </span>
              !
            </p>
            <p className='text-md opacity-90'>
              Mint a unique, non-transferable Soulbound Token (SBT) on the Flare
              network to commemorate this connection forever.
            </p>

            <div className='my-6'>
              <button
                onClick={handleMint}
                disabled={isPending || isConfirming || isConfirmed}
                className='bg-white text-indigo-700 font-bold py-3 px-6 rounded-full disabled:opacity-50 transition-opacity'
              >
                {getButtonText()}
              </button>
            </div>

            {hash && (
              <p className='text-xs opacity-75'>
                Tx Hash: {`${hash.slice(0, 8)}...`}
              </p>
            )}
            {error && (
              <p className='text-xs text-red-300 mt-2'>
                Error: {error.shortMessage}
              </p>
            )}

            <button
              onClick={closeFandomModal}
              className='mt-4 text-xs text-white/70 hover:text-white'
            >
              Maybe Later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
