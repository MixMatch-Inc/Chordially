'use client'

import { proofOfFandomContract } from '@/lib/contracts'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { useState } from 'react'

export default function ContractDemo() {
  const { address, isConnected } = useAccount()
  const [minted, setMinted] = useState(false)

  const { data: balance, isLoading: isBalanceLoading } = useReadContract({
    ...proofOfFandomContract,
    functionName: 'balanceOf',
    args: [address!],
    query: {
      enabled: isConnected,
    },
  })

  const { data: hash, writeContract, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const handleMint = () => {
    writeContract({
      ...proofOfFandomContract,
      functionName: 'mint',
      args: [],
    })
  }

  if (isConfirmed && !minted) {
    setMinted(true)
  }

  if (!isConnected) {
    return (
      <p className='text-center text-gray-500'>
        Please connect your wallet to interact with the contract.
      </p>
    )
  }

  return (
    <div className='p-6 border rounded-lg space-y-4'>
      <h3 className='text-xl font-bold'>Proof of Fandom Contract</h3>

      <div>
        <p>Your Fandom Token Balance:</p>
        {isBalanceLoading ? (
          <span className='text-gray-400'>Loading...</span>
        ) : (
          <span className='text-2xl font-mono'>
            {balance?.toString() ?? '0'}
          </span>
        )}
      </div>

      <div className='flex flex-col items-start space-y-2'>
        <button
          onClick={handleMint}
          disabled={isPending || isConfirming}
          className='bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400'
        >
          {isPending
            ? 'Check Wallet...'
            : isConfirming
              ? 'Minting...'
              : 'Mint a Fandom Token'}
        </button>
        {hash && (
          <p className='text-sm text-gray-500'>
            Transaction Hash: {`${hash.slice(0, 6)}...${hash.slice(-4)}`}
          </p>
        )}
        {minted && (
          <p className='text-green-500 font-bold'>Minted Successfully!</p>
        )}
      </div>
      <p className='text-xs text-gray-400'>
        Note: This interacts with a dummy contract address. The transaction will
        be sent but is expected to fail on-chain. This demo is to verify the
        frontend flow.
      </p>
    </div>
  )
}
