import {
  CurrencyAmount,
  Fetcher,
  JSBI,
  Percent,
  Price,
  Route,
  Token,
  TokenAmount,
  Trade,
  TradeType,
} from '@uniswap/sdk'
import { BigNumber, constants, providers } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import vanillaABI from 'types/abis/vanillaRouter'
import type { TransactionReceipt, UniSwapToken } from 'types/trade'
import { vanillaRouterAddress } from 'utils/config'
import { getContract, tokenListChainId } from '../tokens'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

type TradeProps = {
  amountIn: string
  amountOut: string
  tokenIn: UniSwapToken
  tokenOut: UniSwapToken
  provider?: providers.JsonRpcProvider
  signer?: providers.JsonRpcSigner
}

export const buy = async ({
  amountIn,
  amountOut,
  tokenIn,
  tokenOut,
  signer,
}: TradeProps): Promise<TransactionReceipt> => {
  const amountInParsed = parseUnits(amountIn, tokenIn.decimals)
  const amountOutParsed = parseUnits(amountOut, tokenOut.decimals)

  const vanillaRouter = getContract(
    vanillaRouterAddress,
    JSON.stringify(vanillaABI),
    signer,
  )

  const receipt = await vanillaRouter.depositAndBuy(
    tokenOut.address,
    amountOutParsed,
    constants.MaxUint256,
    { value: amountInParsed },
  )

  return receipt
}

export const sell = async ({
  amountIn,
  amountOut,
  tokenIn,
  tokenOut,
  signer,
}: TradeProps): Promise<TransactionReceipt> => {
  const amountInParsed = parseUnits(amountIn, tokenIn.decimals)
  const amountOutParsed = parseUnits(amountOut, tokenOut.decimals)

  const vanillaRouter = getContract(
    vanillaRouterAddress,
    JSON.stringify(vanillaABI),
    signer,
  )

  const receipt = await vanillaRouter.sellAndWithdraw(
    tokenIn.address,
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
  tradeType = TradeType.EXACT_OUTPUT,
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

    const trade = new Trade(route, parsedAmount, tradeType)

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

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
    .div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(
  value: CurrencyAmount,
  slippage: number,
): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(
      JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)),
      JSBI.BigInt(10000),
    ),
    JSBI.divide(
      JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)),
      JSBI.BigInt(10000),
    ),
  ]
}

// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips
export function computeSlippageAdjustedAmounts(
  trade: Trade | undefined,
  allowedSlippage: number,
): { [field in Field]?: CurrencyAmount } {
  const pct = basisPointsToPercent(allowedSlippage)
  return {
    [Field.INPUT]: trade?.maximumAmountIn(pct),
    [Field.OUTPUT]: trade?.minimumAmountOut(pct),
  }
}
