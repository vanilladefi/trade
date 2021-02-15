import {
  BigintIsh,
  Currency,
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
import { tokenListChainId } from 'lib/tokens'
import { PairByIdQueryResponse } from 'types/trade'
import vanillaABI from 'types/vanillaRouter'
import { vanillaRouterAddress } from 'utils/config'

type TradeProps = {
  tokenAddress: string
  amountETH: BigintIsh
  amount?: string
  provider?: providers.JsonRpcProvider
  signer?: providers.JsonRpcSigner
}

export const buy = async ({
  tokenAddress,
  amountETH,
  signer,
}: TradeProps): Promise<string> => {
  const vanillaRouter = new ethers.Contract(
    vanillaRouterAddress,
    JSON.stringify(vanillaABI),
    signer,
  )
  const receipt = await vanillaRouter.buy(
    tokenAddress,
    12,
    constants.MaxUint256,
    { value: amountETH },
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
  amountIn: BigintIsh,
  selectedPair: PairByIdQueryResponse,
  provider: providers.JsonRpcProvider,
): Promise<Price> {
  try {
    const tokenA = new Token(
      tokenListChainId,
      selectedPair.token0.id,
      parseInt(selectedPair.token0.decimals),
    )
    const tokenB = new Token(
      tokenListChainId,
      selectedPair.token1.id,
      parseInt(selectedPair.token1.decimals),
    )

    const pair = await Fetcher.fetchPairData(tokenA, tokenB, provider)
    const route = new Route([pair], tokenB)

    const trade = new Trade(
      route,
      new TokenAmount(tokenA, amountIn),
      TradeType.EXACT_INPUT,
    )

    return trade.executionPrice
  } catch (error) {
    return error
  }
}

export function tryParseAmount(
  value?: string,
  currency?: Currency,
): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}
