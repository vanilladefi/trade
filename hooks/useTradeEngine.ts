import { Percent as V2Percent, Trade as V2Trade } from '@uniswap/sdk'
import {
  Percent,
  Token as UniswapToken,
  TokenAmount,
  TradeType,
} from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { BigNumber, Transaction } from 'ethers'
import { formatUnits, isAddress, parseUnits } from 'ethers/lib/utils'
import { tokenListChainId } from 'lib/tokens'
import { TransactionProps } from 'lib/uniswap'
import * as uniV2 from 'lib/uniswap/v2/trade'
import * as uniV3 from 'lib/uniswap/v3/trade'
import {
  calculateGasMargin,
  estimateGas,
  estimateReward,
} from 'lib/vanilla/trades'
import { debounce } from 'lodash'
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { currentETHPrice } from 'state/meta'
import {
  currentErrorState,
  currentFeeEstimate,
  currentGasEstimate,
  currentGasLimitEstimate,
  currentGasPrice,
  currentRewardEstimate,
  currentTrade,
  currentTransactionState,
  selectedOperation,
  selectedPairState,
  selectedSlippageTolerance,
  token0Amount,
  token0Selector,
  token1Amount,
  token1Selector,
} from 'state/trade'
import { providerState, signerState } from 'state/wallet'
import { PrerenderProps } from 'types/content'
import { VanillaVersion } from 'types/general'
import { Action, Operation, Token, V3Trade } from 'types/trade'
import {
  blockDeadlineThreshold,
  ethersOverrides,
  vnlDecimals,
} from 'utils/config'
import { getFeeTier, padUniswapTokenToToken } from 'utils/transactions'
import useAllTransactions from './useAllTransactions'
import useEligibleTokenBalance from './useEligibleTokenBalance'
import useTokenBalance from './useTokenBalance'
import useVanillaGovernanceToken from './useVanillaGovernanceToken'
import useWalletAddress from './useWalletAddress'

export enum TransactionState {
  PREPARE,
  PROCESSING,
  DONE,
}

/**
 * A wrapper to handle state whenever user buys or sells tokens.
 */
const useTradeEngine = (
  version: VanillaVersion,
  prerenderProps?: PrerenderProps,
): {
  buy: (options: TransactionProps) => Promise<string | undefined>
  sell: (options: TransactionProps) => Promise<string | undefined>
  trade: V2Trade | V3Trade | null
  executeTrade: () => Promise<string | undefined>
  transactionState: TransactionState
  setTransactionState: Dispatch<SetStateAction<TransactionState>>
  token0: Token | null
  token1: Token | null
  getBalance0Raw: () => BigNumber
  getBalance1Raw: () => BigNumber
  getBalance0: () => string
  getBalance1: () => string
  gasPrice: BigNumber | null
  estimatedGasLimit: BigNumber | null
  estimatedGas: string | null
  estimatedFees: string | null
  estimatedReward: string | null
  notEnoughFunds: () => boolean
  notEnoughLiquidity: () => boolean
  handleAmountChanged: (tokenIndex: 0 | 1, value: string) => Promise<void>
  estimatedRewardInUsd: () => number
  error: string | null
  setError: Dispatch<SetStateAction<string | null>>
} => {
  const { long: walletAddress } = useWalletAddress()
  const signer = useRecoilValue(signerState)
  const provider = useRecoilValue(providerState)
  const operation = useRecoilValue(selectedOperation)
  const pairState = useRecoilValue(selectedPairState)
  const { addTransaction } = useAllTransactions()

  const executeBuy = async ({
    amountPaid,
    amountReceived,
    tokenPaid,
    tokenReceived,
    blockDeadline,
    gasLimit,
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
          gasLimit: gasLimit,
        })
      } else if (version === VanillaVersion.V1_1) {
        transaction = await uniV3.buy({
          amountReceived: amountReceived,
          amountPaid: amountPaid,
          tokenPaid: tokenPaid,
          tokenReceived: tokenReceived,
          signer: signer,
          blockDeadline: blockDeadline,
          feeTier: getFeeTier(pairState?.token0.fee),
          gasLimit: gasLimit,
        })
      }

      transaction?.hash &&
        transaction?.from &&
        addTransaction({
          action: Action.PURCHASE,
          hash: transaction.hash,
          from: transaction.from,
          received: padUniswapTokenToToken(tokenReceived),
          paid: padUniswapTokenToToken(tokenPaid),
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
    gasLimit,
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
          gasLimit: gasLimit,
        })
      } else if (version === version) {
        transaction = await uniV3.sell({
          amountReceived: amountReceived,
          amountPaid: amountPaid,
          tokenPaid: tokenPaid,
          tokenReceived: tokenReceived,
          signer: signer,
          blockDeadline: blockDeadline,
          feeTier: getFeeTier(pairState?.token0.fee),
          gasLimit: gasLimit,
        })
      }
      transaction?.hash &&
        transaction.from &&
        addTransaction({
          action: Action.SALE,
          hash: transaction.hash,
          from: transaction.from,
          received: padUniswapTokenToToken(tokenReceived),
          paid: padUniswapTokenToToken(tokenPaid),
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
  const defaultFeePercentage = new Percent(FeeAmount.MEDIUM, 1_000_000)

  // Selected slippage tolerance
  const slippageTolerance = useRecoilValue(selectedSlippageTolerance)

  // Contains the newest price
  const [trade, setTrade] = useRecoilState<V2Trade | V3Trade | null>(
    currentTrade,
  )

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

  // Balances of token0 and token1 TODO: Doesn't work now for prerendered balances
  const { raw: eligibleBalance0Raw } = useEligibleTokenBalance(
    version,
    token0?.address,
  )
  const { raw: balance1Raw } = useTokenBalance(
    walletAddress,
    token1?.address,
    token1?.decimals,
    true,
  )

  const getBalance0Raw = useCallback(() => {
    let balance0 = eligibleBalance0Raw
    if (!signer) {
      const prerenderedPositions =
        version === VanillaVersion.V1_0
          ? prerenderProps?.initialTokens?.userPositionsV2 || []
          : prerenderProps?.initialTokens?.userPositionsV3 || []
      const token = prerenderedPositions.find(
        (token) =>
          token?.address?.toLowerCase() === token0?.address?.toLowerCase(),
      )
      balance0 = BigNumber.from(token?.ownedRaw ?? '0')
    }
    return balance0
  }, [
    eligibleBalance0Raw,
    prerenderProps?.initialTokens?.userPositionsV2,
    prerenderProps?.initialTokens?.userPositionsV3,
    signer,
    token0?.address,
    version,
  ])

  const getBalance1Raw = useCallback(() => {
    let balance1 = balance1Raw
    if (!signer && token1) {
      balance1 = parseUnits(prerenderProps?.ethBalance ?? '0', token1.decimals)
    }
    return balance1
  }, [balance1Raw, prerenderProps?.ethBalance, signer, token1])

  const getBalance0 = useCallback(() => {
    let formattedBalance = '0'
    if (token0) {
      const raw = getBalance0Raw()
      const token = new UniswapToken(
        tokenListChainId,
        token0?.address,
        Number(token0?.decimals),
      )
      formattedBalance = new TokenAmount(token, raw.toString()).toSignificant()
    }
    return formattedBalance
  }, [getBalance0Raw, token0])

  const getBalance1 = useCallback(() => {
    let formattedBalance = '0'
    if (token1) {
      const raw = getBalance1Raw()
      const token = new UniswapToken(
        tokenListChainId,
        token1?.address,
        Number(token1?.decimals),
      )
      formattedBalance = new TokenAmount(token, raw.toString()).toSignificant()
    }
    return formattedBalance
  }, [getBalance1Raw, token1])

  // Estimates
  const [estimatedGasLimit, setEstimatedGasLimit] = useRecoilState(
    currentGasLimitEstimate,
  )
  const [gasPrice, setGasPrice] = useRecoilState(currentGasPrice)
  const [estimatedGas, setEstimatedGas] = useRecoilState(currentGasEstimate)
  const [estimatedFees, setEstimatedFees] = useRecoilState(currentFeeEstimate)
  const [estimatedReward, setEstimatedReward] = useRecoilState(
    currentRewardEstimate,
  )

  // Error shown in the chin of the modal
  const [error, setError] = useRecoilState(currentErrorState)

  // Transaction state [PREPARE, PROCESSING, DONE]
  const [transactionState, setTransactionState] = useRecoilState(
    currentTransactionState,
  )

  // Token amounts
  const [amount0, setAmount0] = useRecoilState(token0Amount)
  const [amount1, setAmount1] = useRecoilState(token1Amount)

  const notEnoughFunds = useCallback(() => {
    try {
      if (
        (operation === Operation.Buy &&
          amount1 &&
          parseUnits(amount1, token1?.decimals).gt(getBalance1Raw())) ||
        (operation === Operation.Sell &&
          amount0 &&
          parseUnits(amount0, token0?.decimals).gt(getBalance0Raw()))
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
    amount1,
    token1?.decimals,
    getBalance1Raw,
    amount0,
    token0?.decimals,
    getBalance0Raw,
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
    const gasEstimation = async () => {
      if (trade && provider && signer && token0) {
        let gasEstimate = BigNumber.from(ethersOverrides.gasLimit)
        try {
          gasEstimate = await estimateGas(
            version,
            trade,
            signer,
            provider,
            operation,
            token0,
            slippageTolerance,
          ).then(calculateGasMargin)
          if (!gasEstimate.isZero()) {
            setEstimatedGasLimit(gasEstimate)
          } else {
            setEstimatedGasLimit(BigNumber.from(ethersOverrides.gasLimit))
          }
        } catch (e) {
          console.error(
            'Could not estimate gas limit, falling back to ethersOverride of 400000',
          )
        }
        const gasPrice = await provider.getGasPrice()
        if (gasPrice) {
          setGasPrice(gasPrice)
          setEstimatedGas(formatUnits(gasEstimate.mul(gasPrice)))
        }
      }
    }
    const debouncedGasEstimation = debounce(gasEstimation, 200, {
      leading: true,
      trailing: true,
    })
    !notEnoughFunds() && debouncedGasEstimation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trade])

  // Estimate LP fees
  useEffect(() => {
    try {
      if (token1 && token0 && amount0 && amount1) {
        const token = operation === Operation.Buy ? token1 : token0
        const amountParsed =
          operation === Operation.Buy
            ? parseUnits(amount1, token1?.decimals)
            : parseUnits(amount0, token0?.decimals)

        let feeAmount: BigNumber = BigNumber.from('0')
        if (version === VanillaVersion.V1_0) {
          feeAmount = amountParsed
            .mul(defaultFeePercentage.numerator.toString())
            .div(defaultFeePercentage.denominator.toString())
        } else {
          const feeTier = getFeeTier(pairState?.token0.fee)
          if (feeTier) {
            const feePercent = new Percent(feeTier, 1_000_000)
            feeAmount = amountParsed
              .mul(feePercent.numerator.toString())
              .div(feePercent.denominator.toString())
          }
        }

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
    defaultFeePercentage.denominator,
    defaultFeePercentage.numerator,
    token0,
    token1,
    operation,
    amount1,
    amount0,
    setEstimatedFees,
    version,
    pairState?.token0.fee,
  ])

  const updateTrade = async (
    tokenChanged: 0 | 1,
    amount: string | undefined,
  ): Promise<V2Trade | V3Trade | null> => {
    if (token0 && token1 && amount && amount !== '') {
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
                  provider,
                  amount,
                  receivedToken,
                  paidToken,
                  tradeType,
                )
              : await uniV3.constructTrade(
                  signer,
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
    const updateTradeAndToken1 = async () => {
      if (amount0) {
        const trade = await updateTrade(0, amount0)
        if (trade && trade.inputAmount && trade.outputAmount) {
          const newToken1Amount =
            operation === Operation.Buy
              ? trade.inputAmount.toSignificant(6)
              : trade.outputAmount.toSignificant(6)
          setAmount1(newToken1Amount)
        }
      }
    }
    const debouncedUpdate = debounce(updateTradeAndToken1, 200, {
      leading: true,
      trailing: true,
    })
    debouncedUpdate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation, token0, token1])

  // Estimate VNL rewards
  useEffect(() => {
    const estimateRewards = debounce(
      () => {
        if (
          operation === Operation.Sell &&
          signer &&
          token0 &&
          token1 &&
          amount0 &&
          amount1 &&
          isAddress(walletAddress)
        ) {
          estimateReward(
            version,
            walletAddress,
            signer,
            token0,
            token1,
            amount0,
            amount1,
          ).then((reward) => {
            let formattedReward: string | null = null
            if (reward?.reward) {
              formattedReward = formatUnits(reward.reward, vnlDecimals)
            }
            setEstimatedReward(formattedReward)
          })
        } else {
          setEstimatedReward(null)
        }
      },
      500,
      { leading: true, trailing: true },
    )
    estimateRewards()
  }, [
    operation,
    signer,
    token0,
    token1,
    slippageTolerance,
    version,
    amount0,
    amount1,
    setEstimatedReward,
    walletAddress,
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
          setAmount1(newToken1Amount)
        } else {
          setAmount1('0.0')
        }
      }
      setAmount0(value)
    } else {
      if (parseFloat(value) > 0) {
        const trade = await updateTrade(tokenIndex, value)
        if (trade) {
          const newToken0Amount =
            operation === Operation.Buy
              ? trade.outputAmount && trade.outputAmount.toSignificant(6)
              : trade.inputAmount && trade.inputAmount.toSignificant(6)
          setAmount0(newToken0Amount)
        } else {
          setAmount0('0.0')
        }
        setAmount1(value)
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

        let normalizedTrade, normalizedSlippageTolerance
        if (version === VanillaVersion.V1_0) {
          normalizedTrade = trade as V2Trade
          normalizedSlippageTolerance = new V2Percent(
            slippageTolerance.numerator,
            slippageTolerance.denominator,
          )
        } else {
          normalizedTrade = trade as V3Trade
          normalizedSlippageTolerance = slippageTolerance as Percent
        }

        if (operation === Operation.Buy) {
          hash = await executeBuy({
            amountPaid: trade.inputAmount.raw.toString(),
            amountReceived: normalizedTrade
              .minimumAmountOut(normalizedSlippageTolerance)
              .raw.toString(),
            tokenPaid: token1,
            tokenReceived: token0,
            signer: signer,
            blockDeadline: blockDeadline,
            gasLimit: estimatedGasLimit,
          })
        } else {
          hash = await executeSell({
            amountPaid: normalizedTrade.inputAmount.raw.toString(),
            amountReceived: normalizedTrade
              .minimumAmountOut(normalizedSlippageTolerance)
              .raw.toString(),
            tokenPaid: token0,
            tokenReceived: token1,
            signer: signer,
            blockDeadline: blockDeadline,
            gasLimit: estimatedGasLimit,
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

  // Unmount useEffect, clears state for next trade
  useEffect(() => {
    return () => {
      setTrade(null)
      setAmount0(undefined)
      setAmount1(undefined)
      setTransactionState(TransactionState.PREPARE)
      setError(null)
    }
  }, [setAmount0, setAmount1, setError, setTrade, setTransactionState])

  return {
    buy: executeBuy,
    sell: executeSell,
    trade,
    executeTrade,
    transactionState,
    setTransactionState,
    token0,
    token1,
    getBalance0Raw,
    getBalance1Raw,
    getBalance0,
    getBalance1,
    gasPrice,
    estimatedGasLimit,
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
