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
import { BigNumber, constants } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import useTradeEngine from 'hooks/useTradeEngine'
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
import {
  selectedSlippageTolerance,
  token0Selector,
  token1Selector,
} from 'state/trade'
import { providerState, signerState } from 'state/wallet'
import { Operation } from '..'

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

const PrepareView = ({
  operation,
  setOperation,
  setModalCloseEnabled,
}: ContentProps): JSX.Element => {
  const lpFeePercentage = new Percent('3', '1000')
  const slippageTolerance = useRecoilValue(selectedSlippageTolerance)

  const router = useRouter()
  const vanillaRouter = useVanillaRouter()
  const { buy, sell } = useTradeEngine()
  const signer = useRecoilValue(signerState)
  const provider = useRecoilValue(providerState)

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

  const [token0Amount, setToken0Amount] = useState<string>('0')
  const [token1Amount, setToken1Amount] = useState<string>('0')
  const amount0Parsed: () => BigNumber = useCallback(() => {
    if (token0Amount && token0) {
      return parseUnits(token0Amount, token0.decimals)
    } else {
      return BigNumber.from('0')
    }
  }, [token0Amount, token0])
  const amount1Parsed: () => BigNumber = useCallback(() => {
    if (token1Amount && token1) {
      return parseUnits(token1Amount, token1.decimals)
    } else {
      return BigNumber.from('0')
    }
  }, [token1Amount, token1])

  // Estimate gas fees
  useEffect(() => {
    const estimateGas = debounce(() => {
      if (
        provider &&
        vanillaRouter &&
        token0 &&
        token1 &&
        token1Amount &&
        token0Amount &&
        !amount0Parsed().isZero() &&
        !amount1Parsed().isZero()
      ) {
        if (operation === Operation.Buy) {
          vanillaRouter.estimateGas
            .depositAndBuy(
              token0.address,
              amount0Parsed(),
              constants.MaxUint256,
              {
                value: amount1Parsed(),
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
              amount0Parsed(),
              amount1Parsed(),
              constants.MaxUint256,
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
    }, 200)
    estimateGas()
  }, [
    operation,
    token0Amount,
    provider,
    token1Amount,
    token0,
    token1,
    vanillaRouter,
    amount0Parsed,
    amount1Parsed,
  ])

  // Estimate LP fees
  useEffect(() => {
    if (token1 && token0) {
      const token = operation === Operation.Buy ? token1 : token0
      const amountParsed =
        operation === Operation.Buy ? amount1Parsed() : amount0Parsed()
      const feeAmount = amountParsed
        .mul(lpFeePercentage.numerator.toString())
        .div(lpFeePercentage.denominator.toString())
      const feeTokenAmount = new TokenAmount(
        new Token(token.chainId, token.address, token.decimals),
        feeAmount.toString(),
      )
      setEstimatedFees(feeTokenAmount.toSignificant())
    }
  }, [
    lpFeePercentage.denominator,
    lpFeePercentage.numerator,
    token0,
    token1,
    operation,
    amount1Parsed,
    amount0Parsed,
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
          setError(e.message)
        }
      }
    }
    return null
  }

  // Update trade on operation change to get updated pricing
  useEffect(() => {
    const updateTradeAndToken1 = async () => {
      const trade = await updateTrade(0, token0Amount)
      if (trade && trade.minimumAmountOut && trade.maximumAmountIn) {
        const newToken1Amount =
          operation === Operation.Buy
            ? trade.maximumAmountIn(slippageTolerance).toSignificant()
            : trade.minimumAmountOut(slippageTolerance).toSignificant()
        setToken1Amount(newToken1Amount)
      } else {
        setToken1Amount('0.0')
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
  }, [operation, token0Amount, token1Amount, signer, token0, token1])

  // Disable closing of the trade modal when a trade is being processed
  useEffect(() => {
    ;[TransactionState.PROCESSING].includes(transactionState) &&
      setModalCloseEnabled(false)
    return () => {
      setModalCloseEnabled(true)
    }
  }, [setModalCloseEnabled, transactionState])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleAmountChanged = useCallback(
    debounce(async (tokenIndex: 0 | 1, value: string) => {
      if (tokenIndex === 0) {
        setToken0Amount(value)
        if (parseFloat(value) > 0) {
          const trade = await updateTrade(tokenIndex, value)
          if (trade) {
            const newToken1Amount =
              operation === Operation.Buy
                ? trade.maximumAmountIn(slippageTolerance).toSignificant()
                : trade.minimumAmountOut(slippageTolerance).toSignificant()
            setToken1Amount(newToken1Amount)
          } else {
            setToken1Amount('0.0')
          }
        }
      } else {
        setToken1Amount(value)
        if (parseFloat(value) > 0) {
          const trade = await updateTrade(tokenIndex, value)
          if (trade) {
            const newToken0Amount =
              operation === Operation.Buy
                ? trade.minimumAmountOut(slippageTolerance).toSignificant()
                : trade.maximumAmountIn(slippageTolerance).toSignificant()
            setToken0Amount(newToken0Amount)
          }
        } else {
          setToken0Amount('0.0')
        }
      }
    }, 200),
    [setToken0Amount, setToken1Amount, operation],
  )

  const handleClick = async () => {
    if (token0 && token1 && token1Amount && token0Amount && signer) {
      let hash: string | undefined
      try {
        setTransactionState(TransactionState.PROCESSING)

        if (operation === Operation.Buy) {
          hash = await buy({
            amountPaid: token1Amount,
            amountReceived: token0Amount,
            tokenPaid: token1,
            tokenReceived: token0,
            signer: signer,
          })
        } else {
          hash = await sell({
            amountPaid: token0Amount,
            amountReceived: token1Amount,
            tokenPaid: token0,
            tokenReceived: token1,
            signer: signer,
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
                className={operation === Operation.Sell ? 'active' : undefined}
                onClick={() => setOperation(Operation.Sell)}
              >
                Sell
              </button>
            </div>
          </div>

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
                    <span>{estimatedReward} VNL</span>
                  </div>
                )}
              </Column>
            </div>
          )}
        </section>

        <div className='row'>
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
              disabled={[
                TransactionState.PROCESSING,
                TransactionState.DONE,
              ].includes(transactionState)}
              grow
            >
              {token1Amount === null ? (
                <Spinner />
              ) : transactionState === TransactionState.PREPARE ? (
                `${
                  operation.charAt(0).toUpperCase() + operation.slice(1)
                }ing ${token0Amount} ${token0?.symbol}`
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
        `}</style>
      </Column>
    </Suspense>
  )
}

export default PrepareView
