import { buy, sell } from 'lib/uniswap/trade'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { transactionsState } from 'state/transactions'
import { signerState } from 'state/wallet'
import { UniSwapToken } from 'types/trade'
import { chainId } from 'utils/config'

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
      console.log(transaction)
      setTransactions((currentTransactions) => {
        return Object.assign(currentTransactions, { chainId: chainId })
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
      console.log(transaction)
    }
  }

  return { buy: executeBuy, sell: executeSell }
}

export default useTradeEngine
