import { chainId } from 'lib/tokens'
import { buy, sell } from 'lib/uniswap/trade'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { transactionsState } from 'state/transactions'
import { signerState } from 'state/wallet'
import { UniSwapToken } from 'types/trade'

interface TradeExecutionOptions {
  amountIn: string
  amountOut: string
  tokenIn: UniSwapToken
  tokenOut: UniSwapToken
}

const useTradeEngine = () => {
  const signer = useRecoilValue(signerState)
  const setTransactions = useSetRecoilState(transactionsState)

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
      setTransactions((currentTransactions) => {
        const transactions = Object.assign({}, currentTransactions)
        transactions[chainId][transaction.hash] = {
          from: transaction.from,
          hash: transaction.hash,
          addedTime: transaction.blockNumber || 0,
        }
        return transactions
      })
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
      setTransactions((currentTransactions) => {
        const transactions = Object.assign({}, currentTransactions)
        transactions[chainId][transaction.hash] = {
          from: transaction.from,
          hash: transaction.hash,
          addedTime: transaction.blockNumber || 0,
        }
        return transactions
      })
    }
  }

  return { buy: executeBuy, sell: executeSell }
}

export default useTradeEngine
