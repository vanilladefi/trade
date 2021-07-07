import {
  Token as UniswapToken,
  TokenAmount,
  TradeType,
} from '@uniswap/sdk-core'
import { JSBI, Pair, Route, Trade } from '@uniswap/v2-sdk'
import { Transaction } from 'ethers'
import { getAddress, parseUnits } from 'ethers/lib/utils'
import { getContract, tokenListChainId } from 'lib/tokens'
import vanillaRouter from 'types/abis/vanillaRouter.json'
import { VanillaVersion } from 'types/general'
import type { Token, UniSwapToken } from 'types/trade'
import { ethersOverrides, getVanillaRouterAddress } from 'utils/config'
import { TransactionProps } from '..'

export const buy = async ({
  amountPaid,
  amountReceived,
  tokenReceived,
  signer,
  blockDeadline,
  gasLimit,
}: TransactionProps): Promise<Transaction> => {
  const router = getContract(
    getVanillaRouterAddress(VanillaVersion.V1_0),
    JSON.stringify(vanillaRouter.abi),
    signer,
  )

  const usedGasLimit =
    gasLimit !== undefined ? gasLimit : ethersOverrides.gasLimit

  const receipt = await router.depositAndBuy(
    tokenReceived?.address,
    amountReceived,
    blockDeadline,
    { value: amountPaid, gasLimit: usedGasLimit },
  )

  return receipt
}

export const sell = async ({
  amountPaid,
  amountReceived,
  tokenPaid,
  signer,
  blockDeadline,
  gasLimit,
}: TransactionProps): Promise<Transaction> => {
  const router = getContract(
    getVanillaRouterAddress(VanillaVersion.V1_0),
    JSON.stringify(vanillaRouter.abi),
    signer,
  )

  const usedGasLimit =
    gasLimit !== undefined ? gasLimit : ethersOverrides.gasLimit

  const receipt = await router.sellAndWithdraw(
    tokenPaid?.address,
    amountPaid,
    amountReceived,
    blockDeadline,
    { gasLimit: usedGasLimit },
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

    // Parse given ERC-20 and WETH reserves as TokenAmounts
    const { tokenReserve, ethReserve } = parseReserves(tokenPaid, tokenReceived)
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
      return new TokenAmount(convertedToken, JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}

export function parseReserves(
  token0: Token,
  token1: Token,
): { tokenReserve: TokenAmount | null; ethReserve: TokenAmount | null } {
  const tokenReserve = tryParseAmount(
    token0.reserveToken || token1.reserveToken || undefined,
    token0.reserveToken ? token0 : token1,
  )
  const ethReserve = tryParseAmount(
    token1.reserveETH || token0.reserveETH || undefined,
    token1.reserveETH ? token0 : token1,
  )
  return { tokenReserve: tokenReserve ?? null, ethReserve: ethReserve ?? null }
}
