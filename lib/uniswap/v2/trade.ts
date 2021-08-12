import {
  Fetcher,
  JSBI,
  Route,
  Token,
  TokenAmount,
  Trade,
  TradeType,
} from '@uniswap/sdk'
import { providers, Transaction } from 'ethers'
import { getAddress, parseUnits } from 'ethers/lib/utils'
import { getContract, tokenListChainId } from 'lib/tokens'
import vanillaRouter from 'types/abis/vanillaRouter.json'
import { VanillaVersion } from 'types/general'
import type { UniSwapToken } from 'types/trade'
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
  provider: providers.BaseProvider,
  amountToTrade: string, // Not amountPaid because of tradeType
  tokenReceived: UniSwapToken,
  tokenPaid: UniSwapToken,
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
      parseInt(tokenReceived.chainId),
      getAddress(tokenReceived.address),
      parseInt(tokenReceived.decimals),
    )
    const convertedTokenPaid = new Token(
      parseInt(tokenPaid.chainId),
      getAddress(tokenPaid.address),
      parseInt(tokenPaid.decimals),
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
    const convertedToken = new Token(
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
