import { BigNumber } from 'ethers'

export function getTransactionKey(
  transactionHash: string,
  walletAddress: string,
): string {
  return `${walletAddress}-${transactionHash}`
}

export function calculateGasMargin(value: BigNumber): BigNumber {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
    .div(BigNumber.from(10000))
}
