import {
  Token as UniswapToken,
  TokenAmount,
  TradeType,
} from '@uniswap/sdk-core'
import {
  FeeAmount,
  nearestUsableTick,
  Pool,
  Route,
  TickMath,
  TICK_SPACINGS,
  Trade,
} from '@uniswap/v3-sdk'
import { providers, Transaction } from 'ethers'
import { getAddress, parseUnits } from 'ethers/lib/utils'
import JSBI from 'jsbi'
import { getContract, tokenListChainId } from 'lib/tokens'
import vanillaRouter from 'types/abis/vanillaRouter.json'
import type { Token, UniSwapToken } from 'types/trade'
import { ethersOverrides, vanillaRouterAddress } from 'utils/config'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export interface TransactionProps {
  amountReceived: string
  amountPaid: string
  tokenPaid?: UniSwapToken
  tokenReceived?: UniSwapToken
  signer?: providers.JsonRpcSigner
  blockDeadline: number
}

export interface SellProps {
  amountReceived: string
  amountPaid: string
  tokenPaid: UniSwapToken
  tokenReceived: UniSwapToken
  signer?: providers.JsonRpcSigner
  blockDeadline: number
}

export const buy = async ({
  amountPaid,
  amountReceived,
  tokenReceived,
  signer,
  blockDeadline,
}: TransactionProps): Promise<Transaction> => {
  const router = getContract(
    vanillaRouterAddress,
    JSON.stringify(vanillaRouter.abi),
    signer,
  )

  const receipt = await router.depositAndBuy(
    tokenReceived?.address,
    amountReceived,
    blockDeadline,
    { value: amountPaid, ...ethersOverrides },
  )

  return receipt
}

export const sell = async ({
  amountPaid,
  amountReceived,
  tokenPaid,
  signer,
  blockDeadline,
}: TransactionProps): Promise<Transaction> => {
  const router = getContract(
    vanillaRouterAddress,
    JSON.stringify(vanillaRouter.abi),
    signer,
  )

  const receipt = await router.sellAndWithdraw(
    tokenPaid?.address,
    amountPaid,
    amountReceived,
    blockDeadline,
    { ...ethersOverrides },
  )

  return receipt
}

// Pricing function for UniSwap v2 trades
export async function constructTrade(
  amountToTrade: string, // Not amountPaid because of tradeType
  tokenReceived: Token,
  tokenPaid: Token,
  tradeType = TradeType.EXACT_OUTPUT,
): Promise<Trade> {
  const feeAmount = FeeAmount.MEDIUM
  try {
    // The asset that "amountToTrade" refers to changes on tradetype,
    // so we need to set asset and counterAsset here
    const asset =
      tradeType === TradeType.EXACT_OUTPUT ? tokenReceived : tokenPaid
    const counterAsset =
      tradeType === TradeType.EXACT_OUTPUT ? tokenPaid : tokenReceived

    // Convert the decimal amount to a UniSwap TokenAmount
    const parsedAmountTraded = tryParseAmount(amountToTrade, asset)
    if (!parsedAmountTraded)
      return Promise.reject(`Failed to parse input amount: ${amountToTrade}`)

    // Convert our own token format to UniSwap SDK format
    const convertedAsset = new UniswapToken(
      Number(asset.chainId),
      getAddress(asset.address),
      Number(asset.decimals),
    )
    const convertedCounterAsset = new UniswapToken(
      Number(counterAsset.chainId),
      getAddress(counterAsset.address),
      Number(counterAsset.decimals),
    )

    const liquidity =
      tokenReceived.inRangeLiquidity || tokenPaid.inRangeLiquidity || null
    const sqrtPrice = tokenReceived.sqrtPrice || tokenPaid.sqrtPrice || null
    console.log(liquidity, sqrtPrice)
    if (liquidity !== null && sqrtPrice !== null) {
      // Construct a medium fee pool based on TheGraph data
      const pool = new Pool(
        convertedAsset,
        convertedCounterAsset,
        feeAmount,
        sqrtPrice,
        liquidity,
        TickMath.getTickAtSqrtRatio(JSBI.BigInt(sqrtPrice)),
        [
          {
            index: nearestUsableTick(
              TickMath.MIN_TICK,
              TICK_SPACINGS[feeAmount],
            ),
            liquidityNet: liquidity,
            liquidityGross: liquidity,
          },
          {
            index: nearestUsableTick(
              TickMath.MAX_TICK,
              TICK_SPACINGS[feeAmount],
            ),
            liquidityNet: -liquidity,
            liquidityGross: liquidity,
          },
        ],
      )

      console.log(pool)

      // Construct a route based on the parsed liquidity pools
      const route = new Route(
        [pool],
        tradeType === TradeType.EXACT_OUTPUT
          ? convertedCounterAsset
          : convertedAsset,
      )

      console.log(route)

      // Construct a trade with UniSwap SDK
      const trade = Trade.fromRoute(route, parsedAmountTraded, tradeType)

      return trade
    } else {
      return Promise.reject('Liquidity and price info incorrect!')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export function tryParseAmount(
  value?: string,
  currency?: UniSwapToken,
): TokenAmount | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const convertedToken = new UniswapToken(
      tokenListChainId,
      getAddress(currency.address),
      Number(currency.decimals),
    )
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return new TokenAmount(convertedToken, typedValueParsed)
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}
