import { buy, sell } from 'lib/uniswap/trade'
import { useRecoilValue } from 'recoil'
import { signerState } from 'state/wallet'
import { Action, UniSwapToken } from 'types/trade'
import useAllTransactions from './useAllTransactions'

interface TradeExecutionOptions {
  amountIn: string
  amountOut: string
  tokenIn: UniSwapToken
  tokenOut: UniSwapToken
}

const useTradeEngine = (): {
  buy: (options: TradeExecutionOptions) => Promise<string | undefined>
  sell: (options: TradeExecutionOptions) => Promise<string | undefined>
} => {
  const signer = useRecoilValue(signerState)
  const { addTransaction } = useAllTransactions()

  const executeBuy = async ({
    amountIn,
    amountOut,
    tokenIn,
    tokenOut,
  }: TradeExecutionOptions) => {
    if (signer) {
      const transaction = await buy({
        amountOut: amountOut,
        amountIn: amountIn,
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        signer: signer,
      })
      transaction.hash &&
        transaction.from &&
        addTransaction({
          action: Action.PURCHASE,
          hash: transaction.hash,
          from: transaction.from,
          received: tokenOut,
          paid: tokenIn,
          addedTime: Date.now(),
        })
      return transaction.hash || undefined
    }
  }

  const executeSell = async ({
    amountIn,
    amountOut,
    tokenIn,
    tokenOut,
  }: TradeExecutionOptions) => {
    if (signer) {
      const transaction = await sell({
        amountOut: amountOut,
        amountIn: amountIn,
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        signer: signer,
      })
      transaction.hash &&
        transaction.from &&
        addTransaction({
          action: Action.SALE,
          hash: transaction.hash,
          from: transaction.from,
          received: tokenOut,
          paid: tokenIn,
          addedTime: Date.now(),
        })
      return transaction.hash || undefined
    }
  }

  return { buy: executeBuy, sell: executeSell }
}

export default useTradeEngine
