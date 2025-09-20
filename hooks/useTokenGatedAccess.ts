'use client'

import { useAccount, useReadContract } from 'wagmi'
import { Abi } from 'viem'

interface UseTokenGatedAccessProps {
  contract: {
    address: `0x${string}`
    abi: Abi
  }
  requiredBalance?: bigint
}

/**
 * A hook to check if the connected user has a sufficient balance of a token.
 * @param {object} contract - The contract configuration { address, abi }.
 * @param {bigint} [requiredBalance=1n] - The minimum balance required for access. Defaults to 1.
 * @returns An object with { isLoading, hasAccess, balance }.
 */
export function useTokenGatedAccess({
  contract,
  requiredBalance = 1n, // Using bigint for token amounts
}: UseTokenGatedAccessProps) {
  const { address, isConnected } = useAccount()

  const { data: balance, isLoading } = useReadContract({
    ...contract,
    functionName: 'balanceOf',
    args: [address!],
    query: {
      enabled: isConnected && !!address,
    },
  })

  // Determine if the user has access
  const hasAccess = balance !== undefined && balance >= requiredBalance

  return {
    isLoading,
    hasAccess,
    balance,
  }
}
