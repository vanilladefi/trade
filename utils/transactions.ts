import { FeeAmount } from '@uniswap/v3-sdk'
import { Token, UniSwapToken } from 'types/trade'

export function getTransactionKey(
  transactionHash: string,
  walletAddress: string,
): string {
  return `${walletAddress}-${transactionHash}`
}

export function getFeeTier(
  input: string | number | null | undefined,
): FeeAmount | undefined {
  const feeTierString = input?.toString()

  let feeTier: FeeAmount | undefined
  switch (feeTierString) {
    case '500':
      feeTier = FeeAmount.LOW
      break
    case '3000':
      feeTier = FeeAmount.MEDIUM
      break
    case '10000':
      feeTier = FeeAmount.HIGH
      break
    default:
      feeTier = undefined
  }

  return feeTier
}

export function padUniswapTokenToToken(input: UniSwapToken): Token {
  const token = {
    pairId: null,
    logoColor: null,
    ...input,
  }
  return token
}
