import {
  Token as UniswapToken,
  TokenAmount,
  TradeType,
} from '@uniswap/sdk-core'
import {
  InsufficientReservesError,
  JSBI,
  Pair,
  Route,
  Trade,
} from '@uniswap/v2-sdk'
import { BigNumber, providers, Transaction } from 'ethers'
import { getAddress, parseUnits } from 'ethers/lib/utils'
import vanillaRouter from 'types/abis/vanillaRouter.json'
import type { Token, UniSwapToken } from 'types/trade'
import { ethersOverrides, vanillaRouterAddress } from 'utils/config'
import { getContract, tokenListChainId } from '../tokens'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

InsufficientReservesError

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
  try {
    // The asset that "amountToTrade" refers to changes on tradetype,
    // so we need to set received and paid tokens here
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

    // Parse given ERC-20 and WETH reserves as TokenAmounts
    const tokenReserve = tryParseAmount(
      tokenPaid.reserveToken || '0',
      tokenPaid,
    )
    const ethReserve = tryParseAmount(
      tokenReceived.reserveETH || '0',
      tokenReceived,
    )
    if (!tokenReserve || !ethReserve)
      return Promise.reject(
        'No liquidity pool info, cannot calculate next price!',
      )

    // Construct a UniSwap SDK pair with parsed liquidity
    const pair = new Pair(tokenReserve, ethReserve)

    // Construct a route based on the parsed liquidity pools
    const route = new Route(
      [pair],
      tradeType === TradeType.EXACT_OUTPUT
        ? convertedCounterAsset
        : convertedAsset,
    )

    // Construct a trade with UniSwap SDK
    const trade = new Trade(route, parsedAmountTraded, tradeType)

    return trade
  } catch (error) {
    console.log(error)
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
