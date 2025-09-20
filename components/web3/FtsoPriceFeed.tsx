'use client'

import { priceSubmitterContractSGB } from '@/lib/contracts'
import { useReadContract } from 'wagmi'
import { formatUnits } from 'viem'

interface FtsoPriceFeedProps {
  symbol: 'SGB' | 'FLR' // Extendable for other tokens
}

export default function FtsoPriceFeed({ symbol }: FtsoPriceFeedProps) {
  const { data: priceData, isLoading, isError } = useReadContract({
    ...priceSubmitterContractSGB,
    functionName: 'getPrice',
    args: [symbol],
    // Automatically refetch the price every 5 seconds to keep it live
    query: {
      refetchInterval: 5000,
    },
  })

  if (isLoading) {
    return <span className='text-gray-400 animate-pulse'>Loading price...</span>
  }

  if (isError || !priceData) {
    return <span className='text-red-500'>Price unavailable</span>
  }

  // The FTSO returns the price with 5 decimal places.
  // We use formatUnits to correctly place the decimal point.
  const price = Number(formatUnits(priceData[0], 5))
  const timestamp = new Date(Number(priceData[1]) * 1000)

  return (
    <div className='text-sm'>
      <p>
        Live Price: <span className='font-bold text-green-500'>${price.toFixed(5)}</span>
      </p>
      <p className='text-xs text-gray-500'>
        Last Updated: {timestamp.toLocaleTimeString()}
      </p>
    </div>
  )
}