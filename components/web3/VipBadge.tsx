'use client'

import { useTokenGatedAccess } from '@/hooks/useTokenGatedAccess'
import { proofOfFandomContract } from '@/lib/contracts'

export default function VipBadge() {
  const { isLoading, hasAccess } = useTokenGatedAccess({
    contract: proofOfFandomContract,
  })

  if (isLoading) {
    return <div className='h-6 w-16 bg-gray-200 rounded-full animate-pulse'></div>
  }

  if (!hasAccess) {
    return null // If the user doesn't have the token, render nothing
  }

  // If the user has access, show the exclusive badge
  return (
    <div className='inline-flex items-center gap-2 px-3 py-1 font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-4 w-4'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
          clipRule='evenodd'
        />
      </svg>
      <span>Fandom VIP</span>
    </div>
  )
}