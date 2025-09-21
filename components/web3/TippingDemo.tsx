'use client'

import { priceSubmitterContractSGB } from '@/lib/contracts'
import { useState } from 'react'
import { useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import FtsoPriceFeed from './FtsoPriceFeed'

export default function TippingDemo() {
  const [tipAmount, setTipAmount] = useState('1000')

  // We fetch the price here as well to use in our calculation
  const { data: priceData } = useReadContract({
    ...priceSubmitterContractSGB,
    functionName: 'getPrice',
    args: ['SGB'],
    query: {
      refetchInterval: 5000,
    },
  })

  let usdValue = 0
  if (priceData && tipAmount) {
    const price = Number(formatUnits(priceData[0], 5))
    usdValue = Number(tipAmount) * price
  }

  return (
    <div className='p-6 border rounded-lg space-y-4'>
      <h3 className='text-xl font-bold'>Tip an Artist (Demo)</h3>
      <p className='text-sm text-gray-500'>
        See the FTSO in action by calculating a tip's value in real-time.
      </p>

      <div className='flex items-center gap-4'>
        <input
          type='number'
          value={tipAmount}
          onChange={(e) => setTipAmount(e.target.value)}
          className='w-full p-2 rounded-md border-gray-300 shadow-sm sm:text-sm dark:bg-gray-800 dark:border-gray-600'
          placeholder='SGB Amount'
        />
        <span className='font-bold text-lg'>SGB</span>
      </div>

      <div className='p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center'>
        <p className='text-gray-500 dark:text-gray-400'>
          Equivalent Value (USD)
        </p>
        <p className='text-3xl font-bold'>${usdValue.toFixed(2)}</p>
        <div className='mt-2'>
          <FtsoPriceFeed symbol='SGB' />
        </div>
      </div>
    </div>
  )
}
