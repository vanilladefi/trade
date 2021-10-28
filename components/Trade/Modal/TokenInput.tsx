import { Width } from 'components/grid/Flex'
import { formatUnits } from 'ethers/lib/utils'
import useTradeEngine from 'hooks/useTradeEngine'
import { debounce } from 'lodash'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import {
  selectedOperation,
  token0Amount,
  token0Selector,
  token1Amount,
  token1Selector,
} from 'state/trade'
import { PrerenderProps } from 'types/content'
import { VanillaVersion } from 'types/general'
import { Operation } from 'types/trade'

const Dots = dynamic(import('components/Spinner').then((mod) => mod.Dots))
const Column = dynamic(import('components/grid/Flex').then((mod) => mod.Column))
const Icon = dynamic(import('components/typography/Icon'))

type Props = PrerenderProps & {
  version: VanillaVersion
  useWethProxy?: boolean
}

const ethLogoURI =
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'

const TokenInput = ({
  version,
  useWethProxy = true,
  ...rest
}: Props): JSX.Element => {
  const {
    handleAmountChanged,
    getBalance0,
    getBalance0Raw,
    getBalance1,
    getBalance1Raw,
  } = useTradeEngine(version, { ...rest })

  const token0 = useRecoilValue(token0Selector)
  const token1 = useRecoilValue(token1Selector)
  const token0AmountPretty = useRecoilValue(token0Amount)
  const token1AmountPretty = useRecoilValue(token1Amount)

  const operation = useRecoilValue(selectedOperation)

  const [amount0, setAmount0] = useState<string | null | undefined>()
  const [amount1, setAmount1] = useState<string | null | undefined>()
  const [focused, setFocused] = useState<number | undefined>(undefined)

  useEffect(() => {
    token0AmountPretty &&
      token0AmountPretty !== '0' &&
      token0AmountPretty !== '' &&
      setAmount0(token0AmountPretty)
  }, [focused, token0AmountPretty])

  useEffect(() => {
    token1AmountPretty &&
      token1AmountPretty !== '0' &&
      token1AmountPretty !== '' &&
      setAmount1(token1AmountPretty)
  }, [focused, token1AmountPretty])

  const handleAmountChange = (tokenIndex: 0 | 1, value: string) => {
    const parsedValue = value || undefined
    const debouncedAmountChanged = debounce(
      () => handleAmountChanged(tokenIndex, parsedValue),
      200,
      { leading: true, trailing: true },
    )
    if (tokenIndex === 0) {
      setAmount0(parsedValue)
      if (
        parsedValue &&
        parseFloat(parsedValue) > 0 &&
        parsedValue !== amount0
      ) {
        setAmount1(null)
        debouncedAmountChanged()
      } else {
        setAmount1(undefined)
      }
    } else {
      setAmount1(parsedValue)
      if (
        parsedValue &&
        parseFloat(parsedValue) > 0 &&
        parsedValue !== amount1
      ) {
        setAmount0(null)
        debouncedAmountChanged()
      } else {
        setAmount0(undefined)
      }
    }
  }

  const setFocusAtIndex = (focusIndex: 0 | 1, focusState: boolean) => {
    if (focusState) {
      setFocused(focusIndex)
    } else if (focusIndex === focused) {
      setFocused(undefined)
    }
  }

  return (
    <React.Suspense fallback={() => <div></div>}>
      <>
        <div className='tokenInputWrapper'>
          <div className='row'>
            <Column width={Width.SEVEN}>
              <div className='numberInput'>
                <span>Amount to {operation}</span>
                {amount0 !== null ? (
                  <input
                    type='number'
                    placeholder={'0.0'}
                    value={amount0 || ''}
                    onFocus={() => setFocusAtIndex(0, true)}
                    onBlur={() => setFocusAtIndex(0, false)}
                    onInput={(e) => {
                      if (focused === 0) {
                        handleAmountChange(0, e.currentTarget.value)
                      }
                    }}
                    step='0.001'
                  />
                ) : (
                  <div className='spinner'>
                    <Dots />
                  </div>
                )}
                {operation === Operation.Sell && (
                  <button
                    className='maxButton'
                    onClick={() =>
                      token0 &&
                      getBalance0Raw() &&
                      handleAmountChange(
                        0,
                        formatUnits(getBalance0Raw(), token0.decimals),
                      )
                    }
                  >
                    max
                  </button>
                )}
              </div>
            </Column>
            <Column width={Width.FIVE} overflowY={'hidden'}>
              <div className='tokenSelector'>
                <span
                  onClick={() =>
                    token0 &&
                    handleAmountChange(
                      0,
                      formatUnits(getBalance0Raw(), token0.decimals),
                    )
                  }
                  title={
                    (token0 &&
                      formatUnits(getBalance0Raw(), token0.decimals)) ||
                    '0'
                  }
                >
                  Balance: {getBalance0()}
                </span>
                <div className='tokenIndicator'>
                  {token0?.logoURI && <Icon src={token0.logoURI} />}
                  <h2>{token0?.symbol}</h2>
                </div>
              </div>
            </Column>
          </div>

          <div className='row'>
            <Column width={Width.SEVEN}>
              <div className='numberInput'>
                <span>{operation === Operation.Sell ? 'Get' : 'Pay'}</span>
                {amount1 !== null ? (
                  <input
                    type='number'
                    placeholder={'0.0'}
                    value={amount1 || ''}
                    onFocus={() => setFocusAtIndex(1, true)}
                    onBlur={() => setFocusAtIndex(1, false)}
                    onInput={(e) => {
                      if (focused === 1) {
                        handleAmountChange(1, e.currentTarget.value)
                      }
                    }}
                    step='0.001'
                  />
                ) : (
                  <div className='spinner'>
                    <Dots />
                  </div>
                )}
                {operation === Operation.Buy && (
                  <button
                    className='maxButton'
                    onClick={() =>
                      getBalance1Raw() && handleAmountChange(1, getBalance1())
                    }
                  >
                    max
                  </button>
                )}
              </div>
            </Column>
            <Column width={Width.FIVE} overflowY={'hidden'}>
              <div className='tokenSelector'>
                <span
                  onClick={() =>
                    getBalance1Raw() && handleAmountChange(1, getBalance1())
                  }
                  title={getBalance1()}
                >
                  Balance: {getBalance1()}
                </span>
                <div className='tokenIndicator'>
                  {useWethProxy ? (
                    <Icon src={ethLogoURI} />
                  ) : (
                    token1?.logoURI && <Icon src={token1.logoURI} />
                  )}
                  <h2>{useWethProxy ? 'ETH' : token1?.symbol}</h2>
                </div>
              </div>
            </Column>
          </div>
        </div>

        <style jsx>{`
          div,
          input {
            box-sizing: border-box;
          }
          .tokenInputWrapper {
            border-radius: 1.5rem;
            border: 2px solid var(--dark);
            width: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
          }
          .row {
            display: flex;
            position: relative;
            width: 100%;
            flex-direction: row;
            border-bottom: 2px solid var(--dark);
          }
          .row:last-of-type {
            border-bottom: 0;
          }
          .numberInput,
          .tokenSelector {
            display: flex;
            flex-direction: column;
            position: relative;
            padding: 1rem 1.2rem;
            text-overflow: ellipsis;
          }
          .numberInput {
            border-right: 2px solid #332931;
            width: 100%;
            height: 100%;
            display: flex;
            overflow: hidden;
          }
          input {
            margin-top: 1rem;
            position: relative;
            display: flex;
            padding: 0;
            border: 0;
            background: transparent;
            outline: 0;
            min-width: 0 !important;
            width: 100%;
            font-family: var(--monofont);
            font-weight: var(--monoweight);
            font-size: var(--hugemonosize);
          }
          .spinner {
            min-width: 0;
            width: 100%;
            position: relative;
            margin-top: 1rem;
            padding: 1rem 1.2rem;
          }
          .tokenSelector {
            position: relative;
            max-width: 100%;
            overflow: hidden;
          }
          .tokenSelector h2 {
            margin: 0;
            margin-left: 0.2rem;
            font-family: var(--bodyfont);
            font-weight: var(--buttonweight);
            font-size: 1.3rem;
          }
          .tokenIndicator {
            margin: 1rem 0;
            display: flex;
            flex-direction: row;
            align-items: center;
            --iconsize: 2.3rem;
          }
          .maxButton {
            position: absolute;
            top: 1rem;
            right: 1.2rem;
            width: max-content;
            border-radius: 9999px;
            border: 1px solid black;
            background: transparent;
            padding: 0.2rem 0.5rem;
            cursor: pointer;
            outline: 0;
            min-width: 40px;
          }
          .maxButton:hover {
            background: var(--dark);
            color: var(--white);
          }
        `}</style>
      </>
    </React.Suspense>
  )
}

export default TokenInput
