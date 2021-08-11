import { atom } from 'recoil'
import { ConversionState } from 'types/migration'
import { VanillaV1Token01 } from 'types/typechain/vanilla_v1.1/VanillaV1Token01'
import { VanillaV1Token02 } from 'types/typechain/vanilla_v1.1/VanillaV1Token02'

export const tokenConversionState = atom<ConversionState>({
  key: 'tokenConversionState',
  default: ConversionState.LOADING,
})

export const vanillaToken1 = atom<VanillaV1Token01 | null>({
  key: 'vanillaToken1',
  default: null,
  dangerouslyAllowMutability: true,
})

export const vanillaToken2 = atom<VanillaV1Token02 | null>({
  key: 'vanillaToken2',
  default: null,
  dangerouslyAllowMutability: true,
})

export const convertableBalance = atom<string | null>({
  key: 'convertableBalance',
  default: null,
})

export const conversionStartDate = atom<Date | null>({
  key: 'conversionStartDate',
  default: null,
  dangerouslyAllowMutability: true,
})

export const conversionDeadline = atom<Date | null>({
  key: 'conversionDeadline',
  default: null,
  dangerouslyAllowMutability: true,
})

export const merkleProof = atom<string[] | null>({
  key: 'conversionMerkleProof',
  default: null,
})

export const conversionEligibility = atom<boolean>({
  key: 'conversionEligibility',
  default: false,
})

export const conversionAllowance = atom<string | null>({
  key: 'conversionAllowance',
  default: null,
})
