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
  amount: string
  decimals: number
  provider?: providers.JsonRpcProvider
  signer?: providers.JsonRpcSigner
}

export const buy = async ({
  tokenAddress,
  amount,
  decimals = 18,
  signer,
}: TradeProps): Promise<string> => {
  const amountParsed = parseUnits(amount, decimals)

  const vanillaRouter = new ethers.Contract(
    vanillaRouterAddress,
    JSON.stringify(vanillaABI),
    signer,
  )
  const receipt = await vanillaRouter.buy(
    tokenAddress,
    12,
    constants.MaxUint256,
    { value: amountParsed },
  )
  return receipt
}

export const sell = async ({
  tokenAddress,
  amount,
  provider,
}: TradeProps): Promise<string> => {
  const vanillaRouter = new ethers.Contract(
    vanillaRouterAddress,
    JSON.stringify(vanillaABI),
    provider,
  )
  const receipt = await vanillaRouter.sell(
    tokenAddress,
    493,
    amount,
    constants.MaxUint256,
  )
  return receipt
}

export async function getExecutionPrice(
  amountIn: string,
  token0: UniSwapToken,
  token1: UniSwapToken,
  provider: providers.JsonRpcProvider,
): Promise<Price> {
  try {
    const parsedAmount = tryParseAmount(amountIn, token0)
    if (!parsedAmount)
      return Promise.reject(`Failed to parse input amount: ${amountIn}`)

    const convertedToken0 = new Token(
      tokenListChainId,
      token0.address,
      token0.decimals,
    )
    const pair = await Fetcher.fetchPairData(
      convertedToken0,
      new Token(tokenListChainId, token1.address, token1.decimals),
      provider,
    )

    const route = new Route([pair], token1)

    const trade = new Trade(route, parsedAmount, TradeType.EXACT_OUTPUT)

    console.log(trade)

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
