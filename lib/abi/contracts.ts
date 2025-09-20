import proofOfFandomAbi from './abi/ProofOfFandom.json'
import priceSubmitterAbi from './PriceSubmitter.json' // Import the new ABI
import { flare, songbird } from './chains'

const proofOfFandomAddress =
  '0x1234567890123456789012345678901234567890' as const

const priceSubmitterAddressSGB =
  '0x1000000000000000000000000000000000000003' as const

export const proofOfFandomContract = {
  address: proofOfFandomAddress,
  abi: proofOfFandomAbi,

  chains: [flare.id, songbird.id],
}

export const priceSubmitterContractSGB = {
  address: priceSubmitterAddressSGB,
  abi: priceSubmitterAbi,
  // This contract is on the Songbird chain
  chains: [songbird.id],
}
