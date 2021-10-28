import {
  CurrencyAmount,
  Fraction,
  Percent,
  Price,
  Token as UniswapToken,
  TokenAmount,
  TradeType,
} from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { BigNumber, providers, Signer, Transaction } from 'ethers'
import { formatUnits, getAddress, parseUnits } from 'ethers/lib/utils'
import { isAddress, tokenListChainId } from 'lib/tokens'
import { VanillaVersion } from 'types/general'
import { Token, UniSwapToken } from 'types/trade'
import { Quoter, Quoter__factory } from 'types/typechain/uniswap_v3_periphery'
import { VanillaV1Router02__factory } from 'types/typechain/vanilla_v1.1/factories/VanillaV1Router02__factory'
import { conservativeGasLimit, ethersOverrides } from 'utils/config'
import { getUniswapQuoterAddress } from 'utils/config/uniswap'
import { getVanillaRouterAddress } from 'utils/config/vanilla'
import { getFeeTier } from 'utils/transactions'
import { TransactionProps } from '..'

export const UniswapOracle = (oracle: Quoter) => ({
  swap(tokenIn: string, tokenOut: string) {
    return {
      swapParamsIn(amountIn: TokenAmount, fee: number) {
        return {
          tokenIn,
          tokenOut,
          fee: fee,
          sqrtPriceLimitX96: 0,
          amountIn: amountIn.raw.toString(),
        }
      },
      swapParamsOut(amountOut: TokenAmount, fee: number) {
        return {
          tokenIn,
          tokenOut,
          fee: fee,
          sqrtPriceLimitX96: 0,
          amountOut: amountOut.raw.toString(),
        }
      },
      async estimateAmountOut(amountIn: TokenAmount, fee: number) {
        try {
          const swapParams = this.swapParamsIn(amountIn, fee)

          return await oracle.callStatic.quoteExactInputSingle(
            swapParams.tokenIn,
            swapParams.tokenOut,
            fee,
            swapParams.amountIn,
            swapParams.sqrtPriceLimitX96,
            {
              gasLimit: conservativeGasLimit,
            },
          )
        } catch (e) {
          console.error(e)
          return undefined
        }
      },
      async estimateAmountIn(amountOut: TokenAmount, fee: number) {
        try {
          const swapParams = this.swapParamsOut(amountOut, fee)

          return await oracle.callStatic.quoteExactOutputSingle(
            swapParams.tokenIn,
            swapParams.tokenOut,
            fee,
            swapParams.amountOut,
            swapParams.sqrtPriceLimitX96,
            {
              gasLimit: conservativeGasLimit,
            },
          )
        } catch (e) {
          console.error(e)
          return undefined
        }
      },
    }
  },
})

export const buy = async ({
  amountPaid,
  amountReceived,
  tokenReceived,
  signer,
  blockDeadline,
  feeTier,
  gasLimit,
}: TransactionProps): Promise<Transaction> => {
  const vnl1_1Addr = isAddress(getVanillaRouterAddress(VanillaVersion.V1_1))
  if (vnl1_1Addr && tokenReceived?.address && signer && feeTier) {
    const router = VanillaV1Router02__factory.connect(vnl1_1Addr, signer)
    const usedGasLimit = gasLimit ? gasLimit : ethersOverrides.gasLimit
    const orderData = {
      token: tokenReceived.address,
      useWETH: false,
      numEth: amountPaid,
      numToken: amountReceived,
      blockTimeDeadline: blockDeadline,
      fee: feeTier,
    }
    const receipt = await router.executePayable(
      [router.interface.encodeFunctionData('buy', [orderData])],
      { value: amountPaid, gasLimit: usedGasLimit },
    )
    return receipt
  } else {
    return Promise.reject('No Vanilla v1.1 router on used chain!')
  }
}

export const sell = async ({
  amountPaid,
  amountReceived,
  tokenPaid,
  signer,
  blockDeadline,
  feeTier,
  gasLimit,
}: TransactionProps): Promise<Transaction> => {
  const vnl1_1Addr = isAddress(getVanillaRouterAddress(VanillaVersion.V1_1))
  if (vnl1_1Addr && tokenPaid?.address && signer && feeTier) {
    const router = VanillaV1Router02__factory.connect(vnl1_1Addr, signer)
    const usedGasLimit = gasLimit ? gasLimit : ethersOverrides.gasLimit
    const orderData = {
      token: tokenPaid.address,
      useWETH: false,
      numEth: amountReceived,
      numToken: amountPaid,
      blockTimeDeadline: blockDeadline,
      fee: feeTier,
    }
    const receipt = await router.executePayable(
      [router.interface.encodeFunctionData('sell', [orderData])],
      { gasLimit: usedGasLimit },
    )
    return receipt
  } else {
    return Promise.reject('No Vanilla v1.1 router on used chain!')
  }
}

class V3Trade {
  public inputAmount: TokenAmount
  public outputAmount: TokenAmount
  public tradeType: TradeType
  public slippageTolerance: Percent
  public price: Price

  public route = null

  constructor(
    inputAmount: TokenAmount,
    outputAmount: TokenAmount,
    tradeType: TradeType,
  ) {
    this.inputAmount = inputAmount
    this.outputAmount = outputAmount
    this.tradeType = tradeType
    this.price = new Price(
      inputAmount.token,
      outputAmount.token,
      inputAmount.raw.toString(),
      outputAmount.raw.toString(),
    )
    this.route = null
  }

  worstExecutionPrice() {
    return this.price
  }

  get executionPrice() {
    return this.price
  }

  minimumAmountOut(slippageTolerance: Percent) {
    if (this.tradeType === TradeType.EXACT_OUTPUT) {
      return this.outputAmount
    } else {
      const slippageAdjustedAmountOut = new Fraction(1)
        .add(slippageTolerance)
        .invert()
        .multiply(this.outputAmount.raw).quotient
      return this.outputAmount instanceof TokenAmount
        ? new TokenAmount(this.outputAmount.token, slippageAdjustedAmountOut)
        : CurrencyAmount.ether(slippageAdjustedAmountOut)
    }
  }

  maximumAmountIn(slippageTolerance: Percent) {
    if (this.tradeType === TradeType.EXACT_INPUT) {
      return this.inputAmount
    } else {
      const slippageAdjustedAmountIn = new Fraction(1)
        .add(slippageTolerance)
        .multiply(this.inputAmount.raw).quotient
      return this.inputAmount instanceof TokenAmount
        ? new TokenAmount(this.inputAmount.token, slippageAdjustedAmountIn)
        : CurrencyAmount.ether(slippageAdjustedAmountIn)
    }
  }
}

// Pricing function for UniSwap v3 trades
export async function constructTrade(
  signerOrProvider: Signer | providers.Provider,
  amountToTrade: string, // Not amountPaid because of tradeType
  tokenReceived: Token,
  tokenPaid: Token,
  tradeType: TradeType,
): Promise<V3Trade | null> {
  const defaultFeeTier = FeeAmount.MEDIUM
  try {
    const tokenToTrade =
      tradeType === TradeType.EXACT_OUTPUT ? tokenReceived : tokenPaid
    const quotedToken =
      tradeType === TradeType.EXACT_OUTPUT ? tokenPaid : tokenReceived

    // Convert the decimal amount to a UniSwap TokenAmount
    const parsedAmountTraded = tryParseAmount(amountToTrade, tokenToTrade)
    if (!parsedAmountTraded)
      return Promise.reject(`Failed to parse input amount: ${amountToTrade}`)

    const feeTier =
      getFeeTier(tokenReceived.fee) ||
      getFeeTier(tokenPaid.fee) ||
      defaultFeeTier

    const uniV3Oracle = Quoter__factory.connect(
      getUniswapQuoterAddress(),
      signerOrProvider,
    )

    const swapOperation = UniswapOracle(uniV3Oracle).swap(
      isAddress(tokenPaid.address) || tokenPaid.address,
      isAddress(tokenReceived.address) || tokenReceived.address,
    )

    let quote: BigNumber = BigNumber.from(0)
    if (tradeType === TradeType.EXACT_INPUT) {
      const amountOut = await swapOperation.estimateAmountOut(
        parsedAmountTraded,
        feeTier.valueOf(),
      )
      if (amountOut) {
        quote = amountOut
      }
    } else {
      const amountIn = await swapOperation.estimateAmountIn(
        parsedAmountTraded,
        feeTier.valueOf(),
      )
      if (amountIn) {
        quote = amountIn
      }
    }

    const formattedQuote = formatUnits(quote, quotedToken.decimals)
    const parsedQuote = tryParseAmount(formattedQuote, quotedToken)

    if (parsedQuote && parsedAmountTraded) {
      return new V3Trade(
        tradeType === TradeType.EXACT_INPUT ? parsedAmountTraded : parsedQuote,
        tradeType === TradeType.EXACT_INPUT ? parsedQuote : parsedAmountTraded,
        tradeType,
      )
    } else {
      return null
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
