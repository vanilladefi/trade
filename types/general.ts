import { TransactionDetails } from './trade'

export type ChainId = '1' | '2' | '3' | '4' | '42' | '1337'

export type ChainIdToTransactionMapping = {
  [chainId in ChainId]: {
    [transactionKey: string]: TransactionDetails
  }
}

export enum VanillaVersion {
  V1_0,
  V1_1,
}

export type TokenQueryVariables = {
  blockNumber?: number | null
  weth: string
  tokenAddresses: string[]
  poolAddresses?: string[] | null
}
