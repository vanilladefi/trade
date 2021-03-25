import { CurrencyAmount } from '@uniswap/sdk'
import Icon from 'components/typography/Icon'
import { getERC20TokenBalance } from 'lib/tokens'
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { token0Selector, token1Selector } from 'state/trade'
import { providerState } from 'state/wallet'
import { useWallet } from 'use-wallet'
import { Operation } from './Modal'

type Props = {
  operation: Operation
  onAmountChange: (value: string) => void | undefined
  token1In?: CurrencyAmount | number | undefined
  token0Out?: number | undefined
}

const TokenInput = ({
  operation,
  onAmountChange,
  //token0In,
  token1In,
}: Props): JSX.Element => {
  const wallet = useWallet()
  const provider = useRecoilValue(providerState)

  const token0 = useRecoilValue(token0Selector)
  const token1 = useRecoilValue(token1Selector)

  const [balance0, setBalance0] = useState(0)
  const [balance1, setBalance1] = useState(0)

  useEffect(() => {
    if (provider && token0 && token1 && wallet.account) {
      getERC20TokenBalance(wallet.account, token0, provider).then(setBalance0)
      getERC20TokenBalance(wallet.account, token1, provider).then(setBalance1)
    }
  }, [provider, token0, token1, wallet.account])

  return (
    <React.Suspense fallback={() => <div></div>}>
      <>
        <div className='tokenInputWrapper'>
          <div className='row'>
            <div className='numberInput'>
              <span>Amount to {operation}</span>
              <input
                className='input'
                type='number'
                placeholder={'0.0'}
                onInput={(e) => onAmountChange(e.currentTarget.value)}
              />
            </div>
            <div className='tokenSelector'>
              <span>Balance: {balance0}</span>
              <div className='tokenIndicator'>
                {token0?.logoURI && <Icon src={token0.logoURI}></Icon>}
                <h2>{token0?.symbol}</h2>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='numberInput'>
              <span>{operation === Operation.Sell ? 'Get' : 'Pay'}</span>
              <input
                className='input'
                type='number'
                placeholder={'0.0'}
                disabled
                value={token1In?.toString()}
              />
            </div>
            <div className='tokenSelector'>
              <span>Balance: {balance1}</span>
              <div className='tokenIndicator'>
                {token1?.logoURI && <Icon src={token1.logoURI}></Icon>}
                <h2>{token1?.symbol}</h2>
              </div>
            </div>
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
            justify-content: stretch;
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
            width: fit-content;
          }
          .numberInput {
            border-right: 1px solid #332931;
          }
          .input {
            margin-top: 1rem;
            position: relative;
            box-sizing: border-box;
            display: flex;
            padding: 0;
            border: 0;
            background: transparent;
            outline: 0;
            font-family: var(--monofont);
            font-weight: var(--monoweight);
            font-size: var(--hugemonosize);
            max-width: 250px;
            overflow-x: visible;
          }
          .tokenSelector h2 {
            margin: 0;
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
        `}</style>
      </>
    </React.Suspense>
  )
}

export default TokenInput
