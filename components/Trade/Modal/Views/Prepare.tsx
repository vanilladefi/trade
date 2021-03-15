import {
  CurrencyAmount,
  Percent,
  Token,
  TokenAmount,
  Trade,
  TradeType,
  WETH,
} from '@uniswap/sdk'
import { Column, Width } from 'components/grid/Flex'
import Button, {
  ButtonColor,
  ButtonSize,
  ButtonState,
  Rounding,
} from 'components/input/Button'
import { Spinner } from 'components/Spinner'
import Icon, { IconUrls } from 'components/typography/Icon'
import { constants } from 'ethers'
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
  const router = useRouter()
  const vanillaRouter = useVanillaRouter()
  const { buy, sell } = useTradeEngine()

  const signer = useRecoilValue(signerState)
  const provider = useRecoilValue(providerState)
  const token0 = useRecoilValue(token0Selector)
  const token1 = useRecoilValue(token1Selector)
  const slippageTolerance = useRecoilValue(selectedSlippageTolerance)

  const [trade, setTrade] = useState<Trade>()
  const [estimatedGas, setEstimatedGas] = useState<string>()
  const [estimatedFees, setEstimatedFees] = useState<string>()
  const [estimatedReward, setEstimatedReward] = useState<string>()
  const [error, setError] = useState<string | null>(null)
  const [transactionState, setTransactionState] = useState<TransactionState>(
    TransactionState.PREPARE,
  )

  const [token0Amount, setPaidTokenAmount] = useState<string>('0')
  const [token1Amount, setReceivedTokenAmount] = useState<
    TokenAmount | CurrencyAmount | null
  >(new TokenAmount(WETH['1'], '0'))

  // Estimate gas fees
  useEffect(() => {
    const estimateGas = debounce(() => {
      if (
        provider &&
        vanillaRouter &&
        token0 &&
        token1 &&
        token1Amount &&
        token0Amount !== ''
      ) {
        if (operation === Operation.Buy) {
          const amountInParsed = parseUnits(token0Amount, token1.decimals)
          vanillaRouter.estimateGas
            .depositAndBuy(
              token0.address,
              token1Amount.raw.toString(),
              constants.MaxUint256,
              { value: amountInParsed },
            )
            .then((value) => {
              provider.getGasPrice().then((price) => {
                setEstimatedGas(formatUnits(value.mul(price)))
              })
            })
        } else {
          const amountInParsed = parseUnits(token0Amount, token0.decimals)
          vanillaRouter.estimateGas
            .sellAndWithdraw(
              token0.address,
              amountInParsed,
              token1Amount.raw.toString(),
              constants.MaxUint256,
            )
            .then((value) => {
              provider.getGasPrice().then((price) => {
                setEstimatedGas(formatUnits(value.mul(price)))
              })
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
  ])

  // Estimate LP fees
  useEffect(() => {
    if (token1 && token0 && token1Amount && token0Amount) {
      if (operation === Operation.Buy) {
        const feeAmount = token1Amount
          .multiply(lpFeePercentage.numerator.toString())
          .divide(lpFeePercentage.denominator.toString())
        setEstimatedFees(feeAmount.toSignificant(3))
      } else {
        const parsedAmount = parseUnits(token0Amount, token0.decimals)
        const feeAmount = parsedAmount
          .mul(lpFeePercentage.numerator.toString())
          .div(lpFeePercentage.denominator.toString())
        const feeTokenAmount = new TokenAmount(
          new Token(token0.chainId, token0.address, token0.decimals),
          feeAmount.toString(),
        )
        setEstimatedFees(feeTokenAmount.toSignificant())
      }
    }
  }, [
    lpFeePercentage.denominator,
    lpFeePercentage.numerator,
    token0Amount,
    token1Amount,
    token0,
    token1,
    operation,
  ])

  // Update the trade object when parameters change
  useEffect(() => {
    // Show the user that something is happening
    setTransactionState(TransactionState.PROCESSING)

    const updateTrade = debounce(() => {
      // Switch the token ordering based on operation
      let tokenReceived, tokenPaid
      if (operation === Operation.Buy) {
        tokenReceived = token0
        tokenPaid = token1
      } else {
        tokenReceived = token1
        tokenPaid = token0
      }

      // Construct a trade with Uniswap SDK. Pricing the trade happens here.
      if (
        provider &&
        token0Amount &&
        token0Amount !== '0' &&
        tokenReceived &&
        tokenPaid
      ) {
        // Set received token amount to null during calculation
        setReceivedTokenAmount(null)

        constructTrade(
          token0Amount,
          tokenReceived,
          tokenPaid,
          provider,
          operation === Operation.Buy
            ? TradeType.EXACT_OUTPUT
            : TradeType.EXACT_INPUT,
        )
          .then((trade) => {
            trade && setTrade(trade)
          })
          .catch((e) => setError(e.message))
      }
    }, 200)

    updateTrade()

    // Reset trade state to preparation
    setTransactionState(TransactionState.PREPARE)
  }, [token0, token1, provider, token0Amount, operation, slippageTolerance])

  // Set received token amount, based on the trade type and slippage tolerance
  useEffect(() => {
    trade &&
      setReceivedTokenAmount(
        operation === Operation.Buy
          ? trade.maximumAmountIn && trade.maximumAmountIn(slippageTolerance)
          : trade.minimumAmountOut && trade.minimumAmountOut(slippageTolerance),
      )
  }, [operation, slippageTolerance, trade])

  // Estimate VNL rewards
  useEffect(() => {
    const estimateRewards = debounce(() => {
      if (
        operation === Operation.Sell &&
        signer &&
        token0 &&
        token1 &&
        token1Amount
      ) {
        estimateReward(
          signer,
          token0,
          token1,
          token0Amount,
          token1Amount.toSignificant(),
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
    debounce((value: string) => {
      setPaidTokenAmount(value)
    }, 200),
    [setPaidTokenAmount],
  )

  const handleClick = async () => {
    if (token0 && token1 && token1Amount && signer) {
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
        hash && setTransactionState(TransactionState.DONE)
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
