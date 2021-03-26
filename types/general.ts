import { TransactionDetails } from './trade'

export type ChainId = '1' | '2' | '3' | '4' | '42' | '1337'

export type ChainIdToTransactionMapping = {
  [chainId in ChainId]: {
    [transactionKey: string]: TransactionDetails
  }
}
