import {
  CurrencyAmount,
  Fetcher,
  JSBI,
  Price,
  Route,
  Token,
  TokenAmount,
  Trade,
  TradeType,
} from '@uniswap/sdk'
import { constants, ethers, providers } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import type { UniSwapToken } from 'types/trade'
import vanillaABI from 'types/vanillaRouter'
import { vanillaRouterAddress } from 'utils/config'
import { tokenListChainId } from '../tokens'

type TradeProps = {
  tokenAddress: string
  amountIn: string
  amountOut: string
  tokenIn: UniSwapToken
  tokenOut: UniSwapToken
  provider?: providers.JsonRpcProvider
  signer?: providers.JsonRpcSigner
}

export const buy = async ({
  tokenAddress,
  amountIn,
  amountOut,
  tokenIn,
  tokenOut,
  signer,
}: TradeProps): Promise<string> => {
  const amountInParsed = parseUnits(amountIn, tokenIn.decimals)
  const amountOutParsed = parseUnits(amountOut, tokenOut.decimals)

  const vanillaRouter = new ethers.Contract(
    vanillaRouterAddress,
    JSON.stringify(vanillaABI),
    signer,
  )

  const receipt = await vanillaRouter.depositAndBuy(
    tokenAddress,
    amountOutParsed,
    constants.MaxUint256,
    { value: amountInParsed },
  )

  return receipt
}

export const sell = async ({
  tokenAddress,
  amountIn,
  amountOut,
  tokenIn,
  tokenOut,
  signer,
}: TradeProps): Promise<string> => {
  const amountInParsed = parseUnits(amountIn, tokenIn.decimals)
  const amountOutParsed = parseUnits(amountOut, tokenOut.decimals)

  const vanillaRouter = new ethers.Contract(
    vanillaRouterAddress,
    JSON.stringify(vanillaABI),
    signer,
  )

  const receipt = await vanillaRouter.sell(
    tokenAddress,
    amountInParsed,
    amountOutParsed,
    constants.MaxUint256,
  )

  return receipt
}

export async function getExecutionPrice(
  amountToTrade: string,
  tokenOut: UniSwapToken,
  tokenIn: UniSwapToken,
  provider: providers.JsonRpcProvider,
): Promise<Price> {
  try {
    const parsedAmount = tryParseAmount(amountToTrade, tokenOut)
    if (!parsedAmount)
      return Promise.reject(`Failed to parse input amount: ${amountToTrade}`)

    const convertedTokenOut = new Token(
      tokenListChainId,
      tokenOut.address,
      tokenOut.decimals,
    )
    const convertedTokenIn = new Token(
      tokenListChainId,
      tokenIn.address,
      tokenIn.decimals,
    )
    const pair = await Fetcher.fetchPairData(
      convertedTokenOut,
      convertedTokenIn,
      provider,
    )

    const route = new Route([pair], convertedTokenIn)

    const trade = new Trade(route, parsedAmount, TradeType.EXACT_OUTPUT)

    return trade.executionPrice
  } catch (error) {
    console.log(error)
    return error
  }
}

export function tryParseAmount(
  value?: string,
  currency?: UniSwapToken,
): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const convertedToken = new Token(
      tokenListChainId,
      currency.address,
      currency.decimals,
    )
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return new TokenAmount(convertedToken, JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}
