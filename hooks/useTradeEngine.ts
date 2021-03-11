import { buy, BuyProps, sell, SellProps } from 'lib/uniswap/trade'
import { useRecoilValue } from 'recoil'
import { signerState } from 'state/wallet'
import { Action } from 'types/trade'
import useAllTransactions from './useAllTransactions'

const useTradeEngine = (): {
  buy: (options: BuyProps) => Promise<string | undefined>
  sell: (options: SellProps) => Promise<string | undefined>
} => {
  const signer = useRecoilValue(signerState)
  const { addTransaction } = useAllTransactions()

  const executeBuy = async ({
    amountPaid,
    amountReceived,
    tokenPaid,
    tokenReceived,
  }: BuyProps) => {
    if (signer) {
      console.log(amountReceived, amountPaid)
      const transaction = await buy({
        amountReceived: amountReceived,
        amountPaid: amountPaid,
        tokenPaid: tokenPaid,
        tokenReceived: tokenReceived,
        signer: signer,
      })
      transaction.hash &&
        transaction.from &&
        addTransaction({
          action: Action.PURCHASE,
          hash: transaction.hash,
          from: transaction.from,
          received: tokenReceived,
          paid: tokenPaid,
          amountPaid: amountPaid.toSignificant(),
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
  }: SellProps) => {
    if (signer) {
      console.log(amountReceived, amountPaid)
      const transaction = await sell({
        amountReceived: amountReceived,
        amountPaid: amountPaid,
        tokenPaid: tokenPaid,
        tokenReceived: tokenReceived,
        signer: signer,
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
          amountReceived: amountReceived.toSignificant(),
          addedTime: Date.now(),
        })
      return transaction.hash || undefined
    }
  }

  return { buy: executeBuy, sell: executeSell }
}

export default useTradeEngine
