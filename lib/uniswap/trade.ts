import {
  CurrencyAmount,
  Fetcher,
  JSBI,
  Route,
  Token,
  TokenAmount,
  Trade,
  TradeType,
} from '@uniswap/sdk'
import { BigNumber, constants, providers, Transaction } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import vanillaRouter from 'types/abis/vanillaRouter.json'
import type { UniSwapToken } from 'types/trade'
import { vanillaRouterAddress } from 'utils/config'
import { getContract, tokenListChainId } from '../tokens'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export interface BuyProps {
  amountReceived: string
  amountPaid: string
  tokenReceived: UniSwapToken
  tokenPaid: UniSwapToken
  signer?: providers.JsonRpcSigner
}

export interface SellProps {
  amountReceived: string
  amountPaid: string
  tokenPaid: UniSwapToken
  tokenReceived: UniSwapToken
  signer?: providers.JsonRpcSigner
}

export const buy = async ({
  amountPaid,
  amountReceived,
  tokenReceived,
  tokenPaid,
  signer,
}: BuyProps): Promise<Transaction> => {
  const amountReceivedParsed = parseUnits(
    amountReceived,
    tokenReceived.decimals,
  )
  const amountPaidParsed = parseUnits(amountPaid, tokenPaid.decimals)

  const router = getContract(
    vanillaRouterAddress,
    JSON.stringify(vanillaRouter.abi),
    signer,
  )

  const receipt = await router.depositAndBuy(
    tokenReceived.address,
    amountReceivedParsed,
    constants.MaxUint256,
    { value: amountPaidParsed },
  )

  return receipt
}

export const sell = async ({
  amountPaid,
  amountReceived,
  tokenPaid,
  tokenReceived,
  signer,
}: SellProps): Promise<Transaction> => {
  const amountReceivedParsed = parseUnits(
    amountReceived,
    tokenReceived.decimals,
  )
  const amountPaidParsed = parseUnits(amountPaid, tokenPaid.decimals)

  const router = getContract(
    vanillaRouterAddress,
    JSON.stringify(vanillaRouter.abi),
    signer,
  )

  const receipt = await router.sellAndWithdraw(
    tokenPaid.address,
    amountPaidParsed,
    amountReceivedParsed,
    constants.MaxUint256,
  )

  return receipt
}

// Pricing function for all trades
export async function constructTrade(
  amountToTrade: string, // Not amountPaid because of tradeType
  tokenReceived: UniSwapToken,
  tokenPaid: UniSwapToken,
  provider: providers.JsonRpcProvider,
  tradeType = TradeType.EXACT_OUTPUT,
): Promise<Trade> {
  try {
    const parsedAmount = tryParseAmount(
      amountToTrade,
      tradeType === TradeType.EXACT_OUTPUT ? tokenReceived : tokenPaid,
    )
    if (!parsedAmount)
      return Promise.reject(`Failed to parse input amount: ${amountToTrade}`)

    const convertedTokenReceived = new Token(
      tokenReceived.chainId,
      tokenReceived.address,
      tokenReceived.decimals,
    )
    const convertedTokenPaid = new Token(
      tokenPaid.chainId,
      tokenPaid.address,
      tokenPaid.decimals,
    )
    const pair = await Fetcher.fetchPairData(
      convertedTokenReceived,
      convertedTokenPaid,
      provider,
    )

    const route = new Route([pair], convertedTokenPaid)

    const trade = new Trade(route, parsedAmount, tradeType)

    return trade
  } catch (error) {
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
