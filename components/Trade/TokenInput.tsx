import { Column, Width } from 'components/grid/Flex'
import { Spinner } from 'components/Spinner'
import Icon from 'components/typography/Icon'
import { formatUnits } from 'ethers/lib/utils'
import useEligibleTokenBalance from 'hooks/useEligibleTokenBalance'
import useTokenBalance from 'hooks/useTokenBalance'
import useTradeEngine from 'hooks/useTradeEngine'
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { selectedOperation, token0Selector, token1Selector } from 'state/trade'
import { VanillaVersion } from 'types/general'
import { Operation } from 'types/trade'
import { useWallet } from 'use-wallet'

type Props = {
  version: VanillaVersion
  useWethProxy?: boolean
}

const ethLogoURI =
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'

const TokenInput = ({ version, useWethProxy = true }: Props): JSX.Element => {
  const wallet = useWallet()

  const { token0Amount, token1Amount, handleAmountChanged } = useTradeEngine(
    version,
  )

  const token0 = useRecoilValue(token0Selector)
  const token1 = useRecoilValue(token1Selector)

  const operation = useRecoilValue(selectedOperation)

  const [amount0, setAmount0] = useState<string | null | undefined>()
  const [amount1, setAmount1] = useState<string | null | undefined>()
  const [focused, setFocused] = useState<number | undefined>(undefined)

  const {
    formatted: eligibleBalance0,
    raw: eligibleBalance0Raw,
  } = useEligibleTokenBalance(version, token0?.address)
  const { formatted: balance1, raw: balance1Raw } = useTokenBalance(
    token1?.address,
    token1?.decimals,
    true,
  )

  const ethBalance = useWethProxy
    ? formatUnits(wallet.balance, 18)
    : balance1 && token1 && formatUnits(balance1, token1.decimals)

  const ethBalanceRaw = useWethProxy
    ? ethBalance
    : balance1 && token1 && formatUnits(balance1Raw, token1.decimals)

  useEffect(() => {
    token0Amount &&
      token0Amount !== '0' &&
      token0Amount !== '' &&
      setAmount0(token0Amount)
  }, [focused, token0Amount])

  useEffect(() => {
    token1Amount &&
      token1Amount !== '0' &&
      token1Amount !== '' &&
      setAmount1(token1Amount)
  }, [focused, token1Amount])

  const handleAmountChange = (tokenIndex: 0 | 1, value: string) => {
    const parsedValue = value || undefined
    if (tokenIndex === 0) {
      setAmount0(parsedValue)
      if (
        parsedValue &&
        parseFloat(parsedValue) > 0 &&
        parsedValue !== amount0
      ) {
        setAmount1(null)
        handleAmountChanged(tokenIndex, parsedValue)
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
        handleAmountChanged(tokenIndex, parsedValue)
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
                    <Spinner />
                  </div>
                )}
                {operation === Operation.Sell && (
                  <button
                    className='maxButton'
                    onClick={() =>
                      token0 &&
                      eligibleBalance0Raw &&
                      handleAmountChange(
                        0,
                        formatUnits(eligibleBalance0Raw, token0.decimals),
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
                      formatUnits(eligibleBalance0Raw, token0.decimals),
                    )
                  }
                  title={
                    (token0 &&
                      formatUnits(eligibleBalance0Raw, token0.decimals)) ||
                    '0'
                  }
                >
                  Balance: {eligibleBalance0}
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
                    <Spinner />
                  </div>
                )}
                {operation === Operation.Buy && (
                  <button
                    className='maxButton'
                    onClick={() =>
                      ethBalanceRaw && handleAmountChange(1, ethBalanceRaw)
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
                    ethBalanceRaw && handleAmountChange(1, ethBalanceRaw)
                  }
                  title={ethBalance || balance1}
                >
                  Balance: {ethBalance}
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
