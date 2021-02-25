import { Price, TokenAmount, TradeType } from '@uniswap/sdk'
import { Column } from 'components/grid/Flex'
import Button, {
  ButtonColor,
  ButtonSize,
  Rounding,
} from 'components/input/Button'
import { Spinner } from 'components/Spinner'
import useTradeEngine from 'hooks/useTradeEngine'
import { getExecutionPrice, tryParseAmount } from 'lib/uniswap/trade'
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

  const [token1In, setToken1In] = useState<TokenAmount | number | null>(0.0)

  useEffect(() => {
    if (provider && amount && amount !== '0' && token0 && token1) {
      console.log('amount !== 0')
      setToken1In(null)
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
            .catch(console.error)
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
            .catch(console.error)
    }
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
    if (token0 && token1 && token0Out && token1In && signer) {
      let hash: string

      if (operation === Operation.Buy) {
        hash =
          (await buy({
            amountIn: token1In.toString(),
            amountOut: amount,
            tokenIn: token1,
            tokenOut: token0,
          })) || ''
      } else {
        hash =
          (await sell({
            amountIn: amount,
            amountOut: token1In.toString(),
            tokenIn: token0,
            tokenOut: token1,
          })) || ''
      }

      router.push(`/trade?id=${hash}`, undefined, { shallow: true })
    }
  }

  const token0Out = useCallback(
    () => token0 && tryParseAmount(amount, token0),
    [amount, token0],
  )

  return (
    <Suspense fallback={() => <div>Fetching pair data...</div>}>
      <Column>
        <div className='row'>
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

        <div className='row'>
          <TokenInput
            operation={operation}
            onAmountChange={handleAmountChanged}
            //token0Out={token0Out()}
            token1In={token1In ? token1In : null}
          />
        </div>

        {/* TODO: Trade info */}
        <div className='row'></div>

        <div className='row'>
          {token0Out() ? (
            <Button onClick={() => handleClick()} size={ButtonSize.LARGE} grow>
              {token1In && token1In < 0 ? (
                <Spinner />
              ) : (
                `${
                  operation.charAt(0).toUpperCase() + operation.slice(1)
                }ing ${token0Out()?.toSignificant()} ${token0?.symbol}`
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

        <style jsx>{`
          div {
            display: flex;
            padding: 1.1rem 1.2rem;
            --bordercolor: var(--toggleWrapperGradient);
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
        `}</style>
      </Column>
    </Suspense>
  )
}

export default PrepareView
