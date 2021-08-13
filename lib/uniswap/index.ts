import { BigNumber, providers } from 'ethers'
import { UniSwapToken } from 'types/trade'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export interface TransactionProps {
  amountReceived: string
  amountPaid: string
  tokenPaid: UniSwapToken
  tokenReceived: UniSwapToken
  signer?: providers.JsonRpcSigner
  blockDeadline: number
  feeTier?: number
  gasLimit: BigNumber | null
}
