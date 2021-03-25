import { Price } from '@uniswap/sdk'
import { Column } from 'components/grid/Flex'
import Button, {
  ButtonColor,
  ButtonSize,
  Rounding,
} from 'components/input/Button'
import TokenTradeInput from 'components/Trade/TokenInput'
import { buy, getExecutionPrice, sell, tryParseAmount } from 'lib/uniswap/trade'
import debounce from 'lodash.debounce'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useRecoilValue } from 'recoil'
import { token0State, token1State } from 'state/trade'
import { providerState, signerState } from 'state/wallet'
import { PairByIdQueryResponse } from 'types/trade'
import { Operation /*, View*/ } from '..'

type ContentProps = {
  selectedPair: PairByIdQueryResponse | null
  operation: Operation
  setOperation: Dispatch<SetStateAction<Operation>>
  //setCurrentView: Dispatch<SetStateAction<View>>
}

const PrepareView = ({
  selectedPair,
  operation,
  setOperation,
}: //setCurrentView,
ContentProps): JSX.Element => {
  const signer = useRecoilValue(signerState)
  const provider = useRecoilValue(providerState)

  const token0 = useRecoilValue(token0State)
  const token1 = useRecoilValue(token1State)

  const [executionPrice, setExecutionPrice] = useState<Price>()
  const [amount, setAmount] = useState<string>('0')

  useEffect(() => {
    provider &&
      amount &&
      amount !== '0' &&
      token0 &&
      token1 &&
      getExecutionPrice(amount, token0, token1, provider)
        .then((price) => {
          price && setExecutionPrice(price)
        })
        .catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token0, token1, provider, amount])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleAmountChanged = useCallback(
    debounce((value: string) => {
      setAmount(value)
    }, 200),
    [setAmount],
  )

  const token0In = useCallback(() => token0 && tryParseAmount(amount, token0), [
    amount,
    token0,
  ])

  const token1Out = useCallback(() => {
    const ep: string = executionPrice?.toSignificant
      ? executionPrice?.toSignificant()
      : '0'
    return ep ? parseFloat(amount) * parseFloat(ep) : 0
  }, [executionPrice])

  return (
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
        <TokenTradeInput
          operation={operation}
          onAmountChange={handleAmountChanged}
          //token0In={token0In()}
          token1Out={token1Out() > 0 ? token1Out() : undefined}
        />
      </div>

      <div className='row'>
        {token0In() ? (
          <Button
            onClick={() => {
              token0 &&
                token0In &&
                signer &&
                (operation === Operation.Buy
                  ? buy({
                      tokenAddress: token0.address,
                      amount: amount,
                      decimals: token0.decimals,
                      signer: signer,
                    })
                  : sell({
                      tokenAddress: token0.address,
                      amount: amount,
                      decimals: token0.decimals,
                      signer: signer,
                    }))
            }}
            size={ButtonSize.LARGE}
            grow
          >
            {operation.charAt(0).toUpperCase() + operation.slice(1)}ing{' '}
            {token0In()?.toSignificant()} {selectedPair?.token0.symbol}
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
  )
}

export default PrepareView
