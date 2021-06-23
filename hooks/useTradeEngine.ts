import { Transaction } from 'ethers'
import { TransactionProps } from 'lib/uniswap'
import * as uniV2 from 'lib/uniswap/v2/trade'
import * as uniV3 from 'lib/uniswap/v3/trade'
import { useRecoilValue } from 'recoil'
import { signerState } from 'state/wallet'
import { VanillaVersion } from 'types/general'
import { Action } from 'types/trade'
import useAllTransactions from './useAllTransactions'

/**
 * A wrapper to handle state whenever user buys or sells tokens.
 */
const useTradeEngine = (
  version: VanillaVersion,
): {
  buy: (options: TransactionProps) => Promise<string | undefined>
  sell: (options: TransactionProps) => Promise<string | undefined>
} => {
  const signer = useRecoilValue(signerState)
  const { addTransaction } = useAllTransactions()

  const executeBuy = async ({
    amountPaid,
    amountReceived,
    tokenPaid,
    tokenReceived,
    blockDeadline,
  }: TransactionProps) => {
    let transaction: Transaction | undefined = undefined
    if (signer) {
      if (version === VanillaVersion.V1_0) {
        transaction = await uniV2.buy({
          amountReceived: amountReceived,
          amountPaid: amountPaid,
          tokenPaid: tokenPaid,
          tokenReceived: tokenReceived,
          signer: signer,
          blockDeadline: blockDeadline,
        })
      } else if (version === VanillaVersion.V1_1) {
        transaction = await uniV3.buy({
          amountReceived: amountReceived,
          amountPaid: amountPaid,
          tokenPaid: tokenPaid,
          tokenReceived: tokenReceived,
          signer: signer,
          blockDeadline: blockDeadline,
        })
      }
      transaction?.hash &&
        transaction?.from &&
        addTransaction({
          action: Action.PURCHASE,
          hash: transaction.hash,
          from: transaction.from,
          received: tokenReceived,
          paid: tokenPaid,
          amountPaid: amountPaid,
          amountReceived: amountReceived,
          addedTime: Date.now(),
        })
    }
    return transaction?.hash
  }

  const executeSell = async ({
    amountPaid,
    amountReceived,
    tokenPaid,
    tokenReceived,
    blockDeadline,
  }: TransactionProps) => {
    let transaction: Transaction | undefined = undefined
    if (signer) {
      if (version === VanillaVersion.V1_0) {
        transaction = await uniV2.sell({
          amountReceived: amountReceived,
          amountPaid: amountPaid,
          tokenPaid: tokenPaid,
          tokenReceived: tokenReceived,
          signer: signer,
          blockDeadline: blockDeadline,
        })
      } else if (version === VanillaVersion.V1_1) {
        transaction = await uniV3.sell({
          amountReceived: amountReceived,
          amountPaid: amountPaid,
          tokenPaid: tokenPaid,
          tokenReceived: tokenReceived,
          signer: signer,
          blockDeadline: blockDeadline,
        })
      }
      transaction?.hash &&
        transaction.from &&
        addTransaction({
          action: Action.SALE,
          hash: transaction.hash,
          from: transaction.from,
          received: tokenReceived,
          paid: tokenPaid,
          amountPaid: amountPaid,
          amountReceived: amountReceived,
          addedTime: Date.now(),
        })
    }
    return transaction?.hash
  }

  return { buy: executeBuy, sell: executeSell }
}

export default useTradeEngine
