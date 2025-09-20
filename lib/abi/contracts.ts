import proofOfFandomAbi from './abi/ProofOfFandom.json'
import { flare, songbird } from './chains'

const proofOfFandomAddress =
  '0x1234567890123456789012345678901234567890' as const

export const proofOfFandomContract = {
  address: proofOfFandomAddress,
  abi: proofOfFandomAbi,

  chains: [flare.id, songbird.id],
}
