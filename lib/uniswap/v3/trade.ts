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
import { BigNumberish, constants, Signer, Transaction } from 'ethers'
import { formatUnits, getAddress, parseUnits } from 'ethers/lib/utils'
import { UniswapVersion } from 'lib/graphql'
import { isAddress, tokenListChainId } from 'lib/tokens'
import { VanillaVersion } from 'types/general'
import { Operation, Token, UniSwapToken } from 'types/trade'
import { SwapRouter__factory } from 'types/typechain/uniswap_v3_periphery'
import { SwapRouter } from 'types/typechain/uniswap_v3_periphery/SwapRouter'
import { VanillaV1Router02__factory } from 'types/typechain/vanilla_v1.1/factories/VanillaV1Router02__factory'
import {
  ethersOverrides,
  getUniswapRouterAddress,
  getVanillaRouterAddress,
} from 'utils/config'
import { getFeeTier } from 'utils/transactions'
import { TransactionProps } from '..'

export const UniswapRouter = (swapRouter: SwapRouter) => ({
  swap(tokenIn: string, tokenOut: string, recipient: string) {
    return {
      swapParamsIn(amountIn: TokenAmount, fee: number) {
        return {
          tokenIn,
          tokenOut,
          fee,
          amountOutMinimum: 1,
          sqrtPriceLimitX96: 0,
          recipient,
          deadline: constants.MaxUint256,
          amountIn: amountIn.raw.toString(),
        }
      },
      swapParamsOut(amountOut: TokenAmount, fee: number) {
        return {
          tokenIn,
          tokenOut,
          fee,
          amountInMaximum: constants.MaxUint256,
          sqrtPriceLimitX96: 0,
          recipient,
          deadline: constants.MaxUint256,
          amountOut: amountOut.raw.toString(),
        }
      },
      async estimateAmountOut(
        amountIn: TokenAmount,
        fee: number,
        overrides: { value?: BigNumberish } = {},
      ) {
        try {
          const swapParams = this.swapParamsIn(amountIn, fee)
          const exactOut = await swapRouter.callStatic.exactInputSingle(
            swapParams,
            overrides,
          )
          return exactOut
        } catch (e) {
          console.error(e)
          return undefined
        }
      },
      async estimateAmountIn(amountOut: TokenAmount, fee: number) {
        try {
          const swapParams = this.swapParamsOut(amountOut, fee)
          const exactIn = await swapRouter.callStatic.exactOutputSingle(
            swapParams,
          )
          return exactIn
        } catch (e) {
          console.error(e)
          return undefined
        }
      },
      with(
        amountIn: TokenAmount,
        fee: number,
        overrides: { value?: BigNumberish } = {},
      ) {
        return swapRouter.exactInputSingle(
          this.swapParams(amountIn, fee),
          overrides,
        )
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
    slippageTolerance: Percent,
    tradeType: TradeType,
  ) {
    this.inputAmount = inputAmount
    this.outputAmount = outputAmount
    this.slippageTolerance = slippageTolerance
    this.tradeType = tradeType
    this.price = new Price(
      this.inputAmount.token,
      this.outputAmount.token,
      this.inputAmount.raw.toString(),
      this.outputAmount.raw.toString(),
    )
    this.route = null
  }

  worstExecutionPrice() {
    return this.price
  }

  get executionPrice() {
    return this.price
  }

  minimumAmountOut() {
    if (this.tradeType === TradeType.EXACT_OUTPUT) {
      return this.outputAmount
    } else {
      const slippageAdjustedAmountOut = new Fraction(1)
        .add(this.slippageTolerance)
        .invert()
        .multiply(this.outputAmount.raw).quotient
      return this.outputAmount instanceof TokenAmount
        ? new TokenAmount(this.outputAmount.token, slippageAdjustedAmountOut)
        : CurrencyAmount.ether(slippageAdjustedAmountOut)
    }
  }

  maximumAmountIn() {
    if (this.tradeType === TradeType.EXACT_INPUT) {
      return this.inputAmount
    } else {
      const slippageAdjustedAmountIn = new Fraction(1)
        .add(this.slippageTolerance)
        .multiply(this.inputAmount.raw).quotient
      return this.inputAmount instanceof TokenAmount
        ? new TokenAmount(this.inputAmount.token, slippageAdjustedAmountIn)
        : CurrencyAmount.ether(slippageAdjustedAmountIn)
    }
  }
}

// Pricing function for UniSwap v3 trades
export async function constructTrade(
  signer: Signer,
  amountToTrade: string, // Not amountPaid because of tradeType
  tokenReceived: Token,
  tokenPaid: Token,
  tradeType: TradeType,
  operation: Operation,
  recipient: string,
  slippageTolerance: Percent,
): Promise<V3Trade> {
  const defaultFeeTier = FeeAmount.MEDIUM
  try {
    const tokenToTrade =
      tradeType === TradeType.EXACT_OUTPUT
        ? operation === Operation.Buy
          ? tokenReceived
          : tokenPaid
        : operation === Operation.Buy
        ? tokenPaid
        : tokenReceived
    const quotedToken =
      tradeType === TradeType.EXACT_OUTPUT
        ? operation === Operation.Buy
          ? tokenPaid
          : tokenReceived
        : operation === Operation.Buy
        ? tokenReceived
        : tokenPaid

    // Convert the decimal amount to a UniSwap TokenAmount
    const parsedAmountTraded = tryParseAmount(amountToTrade, tokenToTrade)
    if (!parsedAmountTraded)
      return Promise.reject(`Failed to parse input amount: ${amountToTrade}`)

    const feeTier =
      getFeeTier(tokenReceived.fee) ||
      getFeeTier(tokenPaid.fee) ||
      defaultFeeTier

    const uniV3Router = SwapRouter__factory.connect(
      getUniswapRouterAddress(UniswapVersion.v3),
      signer,
    )

    const swapOperation = UniswapRouter(uniV3Router).swap(
      tradeType === TradeType.EXACT_INPUT
        ? tokenToTrade.address
        : quotedToken.address,
      tradeType === TradeType.EXACT_INPUT
        ? quotedToken.address
        : tokenToTrade.address,
      recipient,
    )

    const quote =
      tradeType === TradeType.EXACT_INPUT
        ? operation === Operation.Buy
          ? await swapOperation.estimateAmountOut(parsedAmountTraded, feeTier, {
              value: parsedAmountTraded.raw.toString(),
            })
          : await swapOperation.estimateAmountOut(parsedAmountTraded, feeTier, {
              value: 0,
            })
        : await swapOperation.estimateAmountIn(parsedAmountTraded, feeTier)

    const formattedQuote = formatUnits(quote, quotedToken.decimals)
    const parsedQuote = tryParseAmount(formattedQuote, quotedToken)

    const trade: V3Trade = new V3Trade(
      tradeType === TradeType.EXACT_INPUT ? parsedAmountTraded : parsedQuote,
      tradeType === TradeType.EXACT_INPUT ? parsedQuote : parsedAmountTraded,
      slippageTolerance,
      tradeType,
    )

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
      return new TokenAmount(convertedToken, typedValueParsed)
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}
