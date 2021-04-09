import { Percent, Token, TokenAmount, Trade, TradeType } from '@uniswap/sdk'
import { Column, Width } from 'components/grid/Flex'
import Button, {
  ButtonColor,
  ButtonSize,
  ButtonState,
  Rounding,
} from 'components/input/Button'
import { Spinner } from 'components/Spinner'
import Icon, { IconUrls } from 'components/typography/Icon'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import useEligibleTokenBalance from 'hooks/useEligibleTokenBalance'
import useTokenBalance from 'hooks/useTokenBalance'
import useTradeEngine from 'hooks/useTradeEngine'
import useVanillaGovernanceToken from 'hooks/useVanillaGovernanceToken'
import useVanillaRouter from 'hooks/useVanillaRouter'
import { constructTrade } from 'lib/uniswap/trade'
import { estimateReward } from 'lib/vanilla'
import debounce from 'lodash.debounce'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, {
  Dispatch,
  SetStateAction,
  Suspense,
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
import { Operation } from 'types/trade'
import { blockDeadlineThreshold } from 'utils/config'

type ContentProps = {
  operation: Operation
  setOperation: Dispatch<SetStateAction<Operation>>
  setModalCloseEnabled: Dispatch<SetStateAction<boolean>>
}

const TokenInput = dynamic(() => import('components/Trade/TokenInput'), {
  ssr: false,
})

enum TransactionState {
  PREPARE,
  PROCESSING,
  DONE,
}

type ButtonAmountDisplayProps = {
  operationText: string
  tokenAmount: string
  tokenSymbol: string
}

const ButtonAmountDisplay = ({
  operationText,
  tokenAmount,
  tokenSymbol,
}: ButtonAmountDisplayProps): JSX.Element => (
  <>
    <div>
      {operationText} <span>{tokenAmount}</span> {tokenSymbol}
    </div>
    <style jsx>{`
      div {
        position: relative;
        display: inline-flex;
        max-width: 100%;
        font-family: inherit;
        font-weight: inherit;
        font-size: inherit;
        line-height: inherit;
        margin: 0;
        padding: 0;
        white-space: nowrap;
      }
      div span {
        display: inline-block;
        position: relative;
        font-family: inherit;
        font-weight: inherit;
        font-size: inherit;
        line-height: inherit;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 0.2rem;
        margin-left: 0.2rem;
      }
    `}</style>
  </>
)

const PrepareView = ({
  operation,
  setOperation,
  setModalCloseEnabled,
}: ContentProps): JSX.Element => {
  const lpFeePercentage = new Percent('3', '1000')
  const ethUsdPrice = useRecoilValue(currentETHPrice)
  const slippageTolerance = useRecoilValue(selectedSlippageTolerance)

  const router = useRouter()
  const vanillaRouter = useVanillaRouter()
  const { buy, sell } = useTradeEngine()
  const signer = useRecoilValue(signerState)
  const provider = useRecoilValue(providerState)
  const { price: vnlEthPrice } = useVanillaGovernanceToken()

  const [trade, setTrade] = useState<Trade>()
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

  const [estimatedGas, setEstimatedGas] = useState<string>()
  const [estimatedFees, setEstimatedFees] = useState<string>()
  const [estimatedReward, setEstimatedReward] = useState<string>()

  const [error, setError] = useState<string | null>(null)
  const [transactionState, setTransactionState] = useState<TransactionState>(
    TransactionState.PREPARE,
  )

  const { raw: eligibleBalance0Raw } = useEligibleTokenBalance(token0?.address)
  const { raw: balance1Raw } = useTokenBalance(
    token1?.address,
    token1?.decimals,
    true,
  )
  const [token0Amount, setToken0Amount] = useState<string>('0')
  const [token1Amount, setToken1Amount] = useState<string>('0')

  const isOverFlow = useCallback(() => {
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
    const estimateGas = debounce(async () => {
      if (
        provider &&
        vanillaRouter &&
        token0 &&
        token1 &&
        trade &&
        !parseUnits(token0Amount, token0?.decimals).isZero() &&
        !parseUnits(token1Amount, token1?.decimals).isZero()
      ) {
        const block = await provider.getBlock('latest')
        const blockDeadline = block.timestamp + blockDeadlineThreshold
        if (operation === Operation.Buy) {
          vanillaRouter.estimateGas
            .depositAndBuy(
              token0.address,
              trade?.minimumAmountOut(slippageTolerance).raw.toString(),
              blockDeadline,
              {
                value: trade?.inputAmount.raw.toString(),
              },
            )
            .then((value) => {
              provider.getGasPrice().then((price) => {
                setEstimatedGas(formatUnits(value.mul(price)))
              })
            })
            .catch(() => {
              return
            })
        } else {
          vanillaRouter.estimateGas
            .sellAndWithdraw(
              token0.address,
              trade?.inputAmount.raw.toString(),
              trade?.minimumAmountOut(slippageTolerance).raw.toString(),
              blockDeadline,
            )
            .then((value) => {
              provider.getGasPrice().then((price) => {
                setEstimatedGas(formatUnits(value.mul(price)))
              })
            })
            .catch(() => {
              return
            })
        }
      }
    }, 500)
    estimateGas()
  }, [
    operation,
    token0Amount,
    provider,
    token1Amount,
    token0,
    token1,
    vanillaRouter,
    slippageTolerance,
    trade,
  ])

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
          new Token(token.chainId, token.address, token.decimals),
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
  ): Promise<Trade | null> => {
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

      if (provider && receivedToken && paidToken && !parsedAmount.isZero()) {
        try {
          const trade = await constructTrade(
            amount,
            receivedToken,
            paidToken,
            provider,
            tradeType,
          )
          setTrade(trade)
          return trade
        } catch (e) {
          setError(e.data.message)
        }
      }
    }
    return null
  }

  // Update trade on operation change to get updated pricing
  useEffect(() => {
    const updateTradeAndToken1 = async () => {
      const trade = await updateTrade(0, token0Amount)
      if (trade && trade.inputAmount && trade.outputAmount) {
        const newToken1Amount =
          operation === Operation.Buy
            ? trade.inputAmount.toSignificant(6)
            : trade.outputAmount.toSignificant(6)
        setToken1Amount(newToken1Amount)
      }
    }
    updateTradeAndToken1()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation])

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
        estimateReward(signer, token0, token1, token0Amount, token1Amount).then(
          (reward) => {
            const formattedReward = reward
              ? formatUnits(reward?.reward, 12)
              : undefined
            setEstimatedReward(formattedReward)
          },
        )
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
  ])

  // Disable closing of the trade modal when a trade is being processed
  useEffect(() => {
    ;[TransactionState.PROCESSING].includes(transactionState) &&
      setModalCloseEnabled(false)
    return () => {
      setModalCloseEnabled(true)
    }
  }, [setModalCloseEnabled, transactionState])

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

  const handleClick = async () => {
    if (token0 && token1 && trade && signer && provider) {
      let hash: string | undefined
      try {
        const block = await provider.getBlock('latest')
        const blockDeadline = block.timestamp + blockDeadlineThreshold
        setTransactionState(TransactionState.PROCESSING)

        if (operation === Operation.Buy) {
          hash = await buy({
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
          hash = await sell({
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

        // Wait for a bit, and then redirect the user to the TradeFlower view with more trade info
        setTimeout(() => {
          setTransactionState(TransactionState.PREPARE)
          router.push(`/trade?id=${hash}`, undefined, { shallow: true })
        }, 1500)
      } catch (error) {
        setTransactionState(TransactionState.PREPARE)
        setError(error.message)
      }
    }
  }

  return (
    <Suspense fallback={() => <div>Fetching pair data...</div>}>
      <section style={{ minWidth: '320px', maxWidth: '30rem' }}>
        <Column>
          <section
            className={`inputWrapper${
              [TransactionState.PROCESSING, TransactionState.DONE].includes(
                transactionState,
              )
                ? ' disabled'
                : ''
            }`}
          >
            <div className='row noBottomMargin'>
              <div className='toggleWrapper'>
                <button
                  className={operation === Operation.Buy ? 'active' : undefined}
                  onClick={() => setOperation(Operation.Buy)}
                >
                  Buy
                </button>
                <button
                  className={
                    operation === Operation.Sell ? 'active' : undefined
                  }
                  onClick={() => setOperation(Operation.Sell)}
                  disabled={eligibleBalance0Raw.isZero()}
                >
                  Sell
                </button>
              </div>
            </div>

            <section className='modalMain'>
              <div className='row noBottomMargin'>
                <TokenInput
                  operation={operation}
                  onAmountChange={handleAmountChanged}
                  token0Amount={token0Amount}
                  token1Amount={token1Amount}
                />
              </div>

              {/* TODO: Trade info */}
              {token0Amount && trade?.executionPrice && vanillaRouter && (
                <div className='row'>
                  <Column width={Width.TWELVE}>
                    <div className='tradeInfoRow'>
                      <span>
                        Price per{' '}
                        {operation === Operation.Buy
                          ? token1?.symbol
                          : token0?.symbol}
                      </span>
                      <span>
                        {trade?.executionPrice.toSignificant()}{' '}
                        {operation === Operation.Buy
                          ? token0?.symbol
                          : token1?.symbol}
                      </span>
                    </div>
                    <div className='tradeInfoRow'>
                      <span>Trade value</span>
                      <span>
                        {operation === Operation.Buy
                          ? (
                              parseFloat(trade?.inputAmount.toSignificant()) *
                              ethUsdPrice
                            ).toLocaleString('en-US')
                          : (
                              parseFloat(trade?.outputAmount.toSignificant()) *
                              ethUsdPrice
                            ).toLocaleString('en-US')}{' '}
                        USD
                      </span>
                    </div>
                    <div className='tradeInfoRow'>
                      <span>Estimated gas</span>
                      <span>{estimatedGas} ETH</span>
                    </div>
                    <div className='tradeInfoRow'>
                      <span>Liquidity provider fees</span>
                      <span>
                        {estimatedFees}{' '}
                        {operation === Operation.Buy
                          ? token1?.symbol
                          : token0?.symbol}
                      </span>
                    </div>
                    <div className='tradeInfoRow'>
                      <span>Slippage tolerance</span>
                      <span>{slippageTolerance.toSignificant()} %</span>
                    </div>
                    {estimatedReward && (
                      <div className='tradeInfoRow'>
                        <span>Unclaimed rewards</span>
                        <span>
                          {estimatedReward} VNL{' '}
                          <small>${estimatedRewardInUsd()}</small>
                        </span>
                      </div>
                    )}
                  </Column>
                </div>
              )}
            </section>
          </section>

          <div className='row footer'>
            {token0Amount !== '0' ? (
              <Button
                onClick={() => handleClick()}
                size={ButtonSize.LARGE}
                buttonState={
                  transactionState === TransactionState.PROCESSING
                    ? ButtonState.LOADING
                    : transactionState === TransactionState.DONE
                    ? ButtonState.SUCCESS
                    : ButtonState.NORMAL
                }
                disabled={
                  [TransactionState.PROCESSING, TransactionState.DONE].includes(
                    transactionState,
                  ) || isOverFlow()
                }
                grow
              >
                {token1Amount === null ? (
                  <Spinner />
                ) : notEnoughLiquidity() ? (
                  'Not enough liquidity'
                ) : isOverFlow() ? (
                  'Not enough funds'
                ) : transactionState === TransactionState.PREPARE ? (
                  <ButtonAmountDisplay
                    operationText={`${
                      operation.charAt(0).toUpperCase() + operation.slice(1)
                    }ing`}
                    tokenAmount={token0Amount}
                    tokenSymbol={token0?.symbol ?? ''}
                  />
                ) : transactionState === TransactionState.PROCESSING ? (
                  'Processing'
                ) : (
                  'Done'
                )}
              </Button>
            ) : (
              <Button
                size={ButtonSize.LARGE}
                color={ButtonColor.TRANSPARENT}
                bordered
                rounded={Rounding.ALL}
                grow
              >
                Enter an {token0?.symbol} amount to {operation}
              </Button>
            )}
          </div>

          {error !== null && (
            <div className='row error'>
              <Column width={Width.TWO}>
                <div className='center'>
                  <Icon src={IconUrls.ALERT} />
                </div>
              </Column>
              <Column width={Width.TEN} shrink={true}>
                Something went wrong. Reason:{' '}
                <span className='code'>{error}</span> You can try again.{' '}
                <a onClick={() => setError(null)}>Dismiss notification</a>
              </Column>
            </div>
          )}

          <style jsx>{`
            div {
              display: flex;
              padding: 1.1rem 1.2rem;
              --bordercolor: var(--toggleWrapperGradient);
            }
            .noBottomMargin {
              padding-bottom: 0;
            }
            section.inputWrapper {
              position: relative;
              display: flex;
              width: 100%;
              flex-direction: column;
              margin: 0;
              padding: 0;
              opacity: 1;
            }
            section.inputWrapper.disabled {
              pointer-events: none;
              opacity: 0.5;
            }
            .footer {
              box-shadow: 0px -4px 12px rgba(0, 0, 0, 0.08);
            }
            .modalMain {
              overflow-y: scroll;
              max-height: var(--modal-maxheight);
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .modalMain::-webkit-scrollbar {
              display: none;
            }
            .row {
              position: relative;
              width: 100%;
              flex-direction: row;
              justify-content: space-between;
            }
            .toggleWrapper {
              width: 100%;
              position: relative;
              display: flex;
              padding: 6px;
              flex-direction: row;
              justify-content: stretch;
              border-radius: 9999px;
              background: var(--toggleWrapperGradient);
            }
            .toggleWrapper button {
              flex-grow: 1;
              background: transparent;
              border: 0;
              border-radius: 9999px;
              cursor: pointer;
              outline: 0;
              font-family: var(--bodyfont);
              font-size: var(--largebuttonsize);
              padding: 0.6rem;
              text-transform: uppercase;
              font-weight: var(--bodyweight);
            }
            .toggleWrapper button.active {
              background: white;
              font-weight: var(--buttonweight);
            }
            .error {
              color: var(--alertcolor);
              background: var(--alertbackground);
              font-family: var(--bodyfont);
              font-weight: var(--bodyweight);
              font-size: 0.9rem;
              cursor: text;
              --iconsize: 1.5rem;
              border-top: 2px solid rgba(0, 0, 0, 0.1);
            }
            .error span,
            .error a,
            .error .code {
              display: inline-flex;
              flex-shrink: 1;
              word-break: break-all;
            }
            .code {
              font-family: var(--monofont);
              font-weight: var(--monoweight);
            }
            .error a {
              text-decoration: underline;
              margin-top: 0.5rem;
              cursor: pointer;
            }
            .tradeInfoRow {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              width: 100%;
              border-bottom: 1px solid #d4d4d4;
              padding-left: 0;
              padding-right: 0;
            }
            .tradeInfoRow:last-of-type {
              border-bottom: 0;
            }
            .buttonContent {
              font-family: inherit;
              font-size: inherit;
              font-weight: inherit;
              position: relative;
              height: 100%;
              width: 100%;
              white-space: nowrap;
              overflow-x: hidden;
              overflow-y: visible;
              text-overflow: ellipsis;
            }
          `}</style>
        </Column>
      </section>
    </Suspense>
  )
}

export default PrepareView
