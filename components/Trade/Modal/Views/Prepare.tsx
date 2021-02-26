import { Price, TokenAmount, TradeType } from '@uniswap/sdk'
import { Column, Width } from 'components/grid/Flex'
import Button, {
  ButtonColor,
  ButtonSize,
  ButtonState,
  Rounding,
} from 'components/input/Button'
import { Spinner } from 'components/Spinner'
import Icon, { IconUrls } from 'components/typography/Icon'
import useTradeEngine from 'hooks/useTradeEngine'
import { getExecutionPrice } from 'lib/uniswap/trade'
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
import { token0Selector, token1Selector } from 'state/trade'
import { providerState, signerState } from 'state/wallet'
import { Operation } from '..'

type ContentProps = {
  operation: Operation
  setOperation: Dispatch<SetStateAction<Operation>>
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
}: ContentProps): JSX.Element => {
  const router = useRouter()

  const { buy, sell } = useTradeEngine()
  const signer = useRecoilValue(signerState)
  const provider = useRecoilValue(providerState)

  const token0 = useRecoilValue(token0Selector)
  const token1 = useRecoilValue(token1Selector)

  const [executionPrice, setExecutionPrice] = useState<Price>()
  const [amount, setAmount] = useState<string>('0')
  const [error, setError] = useState<string | null>(null)
  const [transactionState, setTransactionState] = useState<TransactionState>(
    TransactionState.PREPARE,
  )

  const [token1In, setToken1In] = useState<TokenAmount | number | null>(0.0)

  useEffect(() => {
    setToken1In(null)
    setTransactionState(TransactionState.PROCESSING)
    if (provider && amount && amount !== '0' && token0 && token1) {
      operation === Operation.Buy
        ? getExecutionPrice(
            amount,
            token0,
            token1,
            provider,
            TradeType.EXACT_OUTPUT,
          )
            .then((price) => {
              price && setExecutionPrice(price)
            })
            .catch((e) => setError(e.message))
        : getExecutionPrice(
            amount,
            token0,
            token1,
            provider,
            TradeType.EXACT_INPUT,
          )
            .then((price) => {
              price && setExecutionPrice(price)
            })
            .catch((e) => setError(e.message))
    }
    setTransactionState(TransactionState.PREPARE)
  }, [token0, token1, provider, amount, operation])

  useEffect(() => {
    const ep: string = executionPrice?.toSignificant
      ? executionPrice?.toSignificant()
      : '0'
    setToken1In(ep ? parseFloat(amount) / parseFloat(ep) : 0.0)
  }, [amount, executionPrice])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleAmountChanged = useCallback(
    debounce((value: string) => {
      setAmount(value)
    }, 200),
    [setAmount],
  )

  const handleClick = async () => {
    if (token0 && token1 && token1In && signer) {
      let hash: string | undefined
      try {
        setTransactionState(TransactionState.PROCESSING)
        if (operation === Operation.Buy) {
          hash = await buy({
            amountIn: token1In.toString(),
            amountOut: amount,
            tokenIn: token1,
            tokenOut: token0,
          })
        } else {
          hash = await sell({
            amountIn: amount,
            amountOut: token1In.toString(),
            tokenIn: token0,
            tokenOut: token1,
          })
        }
        hash && setTransactionState(TransactionState.DONE)
        setTimeout(() => {
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
              token1In={token1In}
            />
          </div>

          {/* TODO: Trade info */}
          {amount && <div className='row'></div>}
        </section>

        <div className='row'>
          {amount ? (
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
              {token1In && token1In < 0 ? (
                <Spinner />
              ) : transactionState === TransactionState.PREPARE ? (
                `${
                  operation.charAt(0).toUpperCase() + operation.slice(1)
                }ing ${amount} ${token0?.symbol}`
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
              Enter an amount to {operation}
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
            <Column width={Width.TEN}>
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
            display: inline-block;
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
        `}</style>
      </Column>
    </Suspense>
  )
}

export default PrepareView
