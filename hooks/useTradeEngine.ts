import { buy, sell, TransactionProps } from 'lib/uniswap/trade'
import { useRecoilValue } from 'recoil'
import { signerState } from 'state/wallet'
import { Action } from 'types/trade'
import useAllTransactions from './useAllTransactions'

const useTradeEngine = (): {
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
    if (signer) {
      const transaction = await buy({
        amountReceived: amountReceived,
        amountPaid: amountPaid,
        tokenPaid: tokenPaid,
        tokenReceived: tokenReceived,
        signer: signer,
        blockDeadline: blockDeadline,
      })
      transaction.hash &&
        transaction.from &&
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
      return transaction.hash || undefined
    }
  }

  const executeSell = async ({
    amountPaid,
    amountReceived,
    tokenPaid,
    tokenReceived,
    blockDeadline,
  }: TransactionProps) => {
    if (signer) {
      const transaction = await sell({
        amountReceived: amountReceived,
        amountPaid: amountPaid,
        tokenPaid: tokenPaid,
        tokenReceived: tokenReceived,
        signer: signer,
        blockDeadline: blockDeadline,
      })
      transaction.hash &&
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
      return transaction.hash || undefined
    }
  }

  return { buy: executeBuy, sell: executeSell }
}

export default useTradeEngine
