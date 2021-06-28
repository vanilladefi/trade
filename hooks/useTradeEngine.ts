import {
  Percent,
  Token as UniswapToken,
  TokenAmount,
  TradeType,
} from '@uniswap/sdk-core'
import { Trade as V2Trade } from '@uniswap/v2-sdk'
import { FeeAmount, Trade as V3Trade } from '@uniswap/v3-sdk'
import { BigNumber, Transaction } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { TransactionProps } from 'lib/uniswap'
import * as uniV2 from 'lib/uniswap/v2/trade'
import * as uniV3 from 'lib/uniswap/v3/trade'
import { estimateGas, estimateReward } from 'lib/vanilla'
import { debounce } from 'lodash'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useRecoilValue } from 'recoil'
import { currentETHPrice } from 'state/meta'
import {
  selectedSlippageTolerance,
  token0Selector,
  token1Selector,
} from 'state/trade'
import { providerState, signerState } from 'state/wallet'
import { VanillaVersion } from 'types/general'
import { Action, Operation, Token } from 'types/trade'
import { blockDeadlineThreshold } from 'utils/config'
import useAllTransactions from './useAllTransactions'
import useEligibleTokenBalance from './useEligibleTokenBalance'
import useTokenBalance from './useTokenBalance'
import useVanillaGovernanceToken from './useVanillaGovernanceToken'

export enum TransactionState {
  PREPARE,
  PROCESSING,
  DONE,
}

/**
 * A wrapper to handle state whenever user buys or sells tokens.
 */
const useTradeEngine = (
  operation: Operation,
  version: VanillaVersion,
): {
  buy: (options: TransactionProps) => Promise<string | undefined>
  sell: (options: TransactionProps) => Promise<string | undefined>
  trade: V2Trade | V3Trade | undefined
  executeTrade: () => Promise<string | undefined>
  transactionState: TransactionState
  setTransactionState: Dispatch<SetStateAction<TransactionState>>
  token0: Token | null
  token1: Token | null
  token0Amount: string
  token1Amount: string
  eligibleBalance0Raw: BigNumber
  balance1Raw: BigNumber
  estimatedGas: string | undefined
  estimatedFees: string | undefined
  estimatedReward: string | undefined
  notEnoughFunds: () => boolean
  notEnoughLiquidity: () => boolean
  handleAmountChanged: (tokenIndex: 0 | 1, value: string) => Promise<void>
  estimatedRewardInUsd: () => number
  error: string | null
  setError: Dispatch<SetStateAction<string | null>>
} => {
  // The Ethers signer and provider
  const signer = useRecoilValue(signerState)
  const provider = useRecoilValue(providerState)
  const { addTransaction } = useAllTransactions()

  const executeBuy = async ({
    amountPaid,
    amountReceived,
    tokenPaid,
    tokenReceived,
    blockDeadline,
  }: TransactionProps) => {
    let transaction: Transaction | undefined = undefined
    if (signer) {
      if (version === VanillaVersion.V1_0) {
        transaction = await uniV2.buy({
          amountReceived: amountReceived,
          amountPaid: amountPaid,
          tokenPaid: tokenPaid,
          tokenReceived: tokenReceived,
          signer: signer,
          blockDeadline: blockDeadline,
        })
      } else if (version === version) {
        transaction = await uniV3.buy({
          amountReceived: amountReceived,
          amountPaid: amountPaid,
          tokenPaid: tokenPaid,
          tokenReceived: tokenReceived,
          signer: signer,
          blockDeadline: blockDeadline,
        })
      }
      transaction?.hash &&
        transaction?.from &&
        addTransaction({
          action: Action.PURCHASE,
          hash: transaction.hash,
          from: transaction.from,
          received: tokenReceived,
          paid: tokenPaid,
          amountPaid: amountPaid,
          amountReceived: amountReceived,
          addedTime: Date.now(),
        })
    }
    return transaction?.hash
  }

  const executeSell = async ({
    amountPaid,
    amountReceived,
    tokenPaid,
    tokenReceived,
    blockDeadline,
  }: TransactionProps) => {
    let transaction: Transaction | undefined = undefined
    if (signer) {
      if (version === VanillaVersion.V1_0) {
        transaction = await uniV2.sell({
          amountReceived: amountReceived,
          amountPaid: amountPaid,
          tokenPaid: tokenPaid,
          tokenReceived: tokenReceived,
          signer: signer,
          blockDeadline: blockDeadline,
        })
      } else if (version === version) {
        transaction = await uniV3.sell({
          amountReceived: amountReceived,
          amountPaid: amountPaid,
          tokenPaid: tokenPaid,
          tokenReceived: tokenReceived,
          signer: signer,
          blockDeadline: blockDeadline,
        })
      }
      transaction?.hash &&
        transaction.from &&
        addTransaction({
          action: Action.SALE,
          hash: transaction.hash,
          from: transaction.from,
          received: tokenReceived,
          paid: tokenPaid,
          amountPaid: amountPaid,
          amountReceived: amountReceived,
          addedTime: Date.now(),
        })
    }
    return transaction?.hash
  }

  // VNL/ETH price
  const { price: vnlEthPrice } = useVanillaGovernanceToken(version)

  // ETH/USD price
  const ethUsdPrice = useRecoilValue(currentETHPrice)

  // Liquidity provider fee percentage. By default we use the medium pool with 0.3% LP fees
  const lpFeePercentage = new Percent(FeeAmount.MEDIUM, 1_000_000)

  // Selected slippage tolerance
  const slippageTolerance = useRecoilValue(selectedSlippageTolerance)

  // Contains the newest price
  const [trade, setTrade] = useState<V2Trade | V3Trade>()

  // Token selectors
  const token0 = useRecoilValue(token0Selector)
  const token1 = useRecoilValue(token1Selector)
  const tokenPaid = useCallback(
    () => (operation === Operation.Buy ? token1 : token0),
    [operation, token0, token1],
  )
  const tokenReceived = useCallback(
    () => (operation === Operation.Buy ? token0 : token1),
    [operation, token0, token1],
  )
  // Balances of token0 and token1
  const { raw: eligibleBalance0Raw } = useEligibleTokenBalance(
    version,
    token0?.address,
  )
  const { raw: balance1Raw } = useTokenBalance(
    token1?.address,
    token1?.decimals,
    true,
  )

  // Estimates
  const [estimatedGas, setEstimatedGas] = useState<string>()
  const [estimatedFees, setEstimatedFees] = useState<string>()
  const [estimatedReward, setEstimatedReward] = useState<string>()

  // Error shown in the chin of the modal
  const [error, setError] = useState<string | null>(null)

  // Transaction state [PREPARE, PROCESSING, DONE]
  const [transactionState, setTransactionState] = useState<TransactionState>(
    TransactionState.PREPARE,
  )

  // Token amounts
  const [token0Amount, setToken0Amount] = useState<string>('0')
  const [token1Amount, setToken1Amount] = useState<string>('0')

  const notEnoughFunds = useCallback(() => {
    try {
      if (
        (operation === Operation.Buy &&
          parseUnits(token1Amount, token1?.decimals).gt(balance1Raw)) ||
        (operation === Operation.Sell &&
          parseUnits(token0Amount, token0?.decimals).gt(eligibleBalance0Raw))
      ) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return true
    }
  }, [
    operation,
    token1Amount,
    token1?.decimals,
    balance1Raw,
    token0Amount,
    token0?.decimals,
    eligibleBalance0Raw,
  ])

  const estimatedRewardInUsd = useCallback(() => {
    const unrealizedVnl = estimatedReward
    if (unrealizedVnl) {
      return parseFloat(unrealizedVnl) * parseFloat(vnlEthPrice) * ethUsdPrice
    } else {
      return 0
    }
  }, [estimatedReward, ethUsdPrice, vnlEthPrice])

  const notEnoughLiquidity = useCallback(() => {
    if (trade instanceof Error) {
      const error = trade as Error
      if (error.name === 'InsufficientReservesError') {
        return true
      }
    }
    return false
  }, [trade])

  // Estimate gas fees
  useEffect(() => {
    const debouncedGasEstimation = debounce(async () => {
      if (trade && provider && token0) {
        const gasEstimate = await estimateGas(
          version,
          trade,
          provider,
          operation,
          token0,
          slippageTolerance,
        )
        setEstimatedGas(gasEstimate)
      }
    }, 500)
    debouncedGasEstimation()
  }, [operation, provider, token0, slippageTolerance, trade, version])

  // Estimate LP fees
  useEffect(() => {
    try {
      if (token1 && token0) {
        const token = operation === Operation.Buy ? token1 : token0
        const amountParsed =
          operation === Operation.Buy
            ? parseUnits(token1Amount, token1?.decimals)
            : parseUnits(token0Amount, token0?.decimals)
        const feeAmount = amountParsed
          .mul(lpFeePercentage.numerator.toString())
          .div(lpFeePercentage.denominator.toString())
        const feeTokenAmount = new TokenAmount(
          new UniswapToken(
            Number(token.chainId),
            token.address,
            Number(token.decimals),
          ),
          feeAmount.toString(),
        )
        setEstimatedFees(feeTokenAmount.toSignificant())
      }
    } catch (e) {
      console.error(e)
    }
  }, [
    lpFeePercentage.denominator,
    lpFeePercentage.numerator,
    token0,
    token1,
    operation,
    token1Amount,
    token0Amount,
  ])

  const updateTrade = async (
    tokenChanged: 0 | 1,
    amount: string,
  ): Promise<V2Trade | V3Trade | null> => {
    if (token0 && token1) {
      const receivedToken = tokenReceived()
      const paidToken = tokenPaid()

      const tradeType =
        tokenChanged === 0
          ? operation === Operation.Buy
            ? TradeType.EXACT_OUTPUT
            : TradeType.EXACT_INPUT
          : operation === Operation.Buy
          ? TradeType.EXACT_INPUT
          : TradeType.EXACT_OUTPUT

      const parsedAmount = parseUnits(
        amount,
        tokenChanged === 0 ? token0.decimals : token1.decimals,
      )

      if (receivedToken && paidToken && !parsedAmount.isZero()) {
        try {
          const trade =
            version === VanillaVersion.V1_0
              ? await uniV2.constructTrade(
                  amount,
                  receivedToken,
                  paidToken,
                  tradeType,
                )
              : await uniV3.constructTrade(
                  amount,
                  receivedToken,
                  paidToken,
                  tradeType,
                )
          setTrade(trade)
          return trade
        } catch (e) {
          setError(e?.data?.message ?? e.toString())
        }
      }
    }
    return null
  }

  // Update trade on operation change to get updated pricing
  useEffect(() => {
    const updateTradeAndToken1 = debounce(async () => {
      const trade = await updateTrade(0, token0Amount)
      if (trade && trade.inputAmount && trade.outputAmount) {
        const newToken1Amount =
          operation === Operation.Buy
            ? trade.inputAmount.toSignificant(6)
            : trade.outputAmount.toSignificant(6)
        setToken1Amount(newToken1Amount)
      }
    }, 200)
    updateTradeAndToken1()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation, token0, token1])

  // Estimate VNL rewards
  useEffect(() => {
    const estimateRewards = debounce(() => {
      if (
        operation === Operation.Sell &&
        signer &&
        token0 &&
        token1 &&
        token0Amount &&
        token1Amount
      ) {
        estimateReward(
          version,
          signer,
          token0,
          token1,
          token0Amount,
          token1Amount,
        ).then((reward) => {
          const formattedReward = reward
            ? formatUnits(reward?.reward, 12)
            : undefined
          setEstimatedReward(formattedReward)
        })
      } else {
        setEstimatedReward(undefined)
      }
    }, 500)
    estimateRewards()
  }, [
    operation,
    token0Amount,
    token1Amount,
    signer,
    token0,
    token1,
    slippageTolerance,
    version,
  ])

  const handleAmountChanged = async (tokenIndex: 0 | 1, value: string) => {
    if (tokenIndex === 0) {
      if (parseFloat(value) > 0) {
        const trade = await updateTrade(tokenIndex, value)
        if (trade) {
          const newToken1Amount =
            operation === Operation.Buy
              ? trade.inputAmount && trade.inputAmount.toSignificant(6)
              : trade.outputAmount && trade.outputAmount.toSignificant(6)
          setToken1Amount(newToken1Amount)
        } else {
          setToken1Amount('0.0')
        }
      }
      setToken0Amount(value)
    } else {
      if (parseFloat(value) > 0) {
        const trade = await updateTrade(tokenIndex, value)
        if (trade) {
          const newToken0Amount =
            operation === Operation.Buy
              ? trade.outputAmount && trade.outputAmount.toSignificant(6)
              : trade.inputAmount && trade.inputAmount.toSignificant(6)
          setToken0Amount(newToken0Amount)
        } else {
          setToken0Amount('0.0')
        }
        setToken1Amount(value)
      }
    }
  }

  const executeTrade = async (): Promise<string | undefined> => {
    if (token0 && token1 && trade && signer && provider) {
      let hash: string | undefined
      try {
        const block = await provider.getBlock('latest')
        const blockDeadline = block.timestamp + blockDeadlineThreshold
        setTransactionState(TransactionState.PROCESSING)

        if (operation === Operation.Buy) {
          hash = await executeBuy({
            amountPaid: trade.inputAmount.raw.toString(),
            amountReceived: trade
              .minimumAmountOut(slippageTolerance)
              .raw.toString(),
            tokenPaid: token1,
            tokenReceived: token0,
            signer: signer,
            blockDeadline: blockDeadline,
          })
        } else {
          hash = await executeSell({
            amountPaid: trade.inputAmount.raw.toString(),
            amountReceived: trade
              .minimumAmountOut(slippageTolerance)
              .raw.toString(),
            tokenPaid: token0,
            tokenReceived: token1,
            signer: signer,
            blockDeadline: blockDeadline,
          })
        }

        // Show the successful trade status to user in the button with a checkmark
        hash && setTransactionState(TransactionState.DONE)
        return hash
      } catch (error) {
        setTransactionState(TransactionState.PREPARE)
        setError(error.message)
        return
      }
    }
  }

  return {
    buy: executeBuy,
    sell: executeSell,
    trade,
    executeTrade,
    transactionState,
    setTransactionState,
    token0,
    token1,
    token0Amount,
    token1Amount,
    eligibleBalance0Raw,
    balance1Raw,
    estimatedGas,
    estimatedFees,
    estimatedReward,
    notEnoughFunds,
    notEnoughLiquidity,
    handleAmountChanged,
    estimatedRewardInUsd,
    error,
    setError,
  }
}

export default useTradeEngine
