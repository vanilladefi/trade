export function getTransactionKey(
  transactionHash: string,
  walletAddress: string,
): string {
  return `${walletAddress}-${transactionHash}`
}
