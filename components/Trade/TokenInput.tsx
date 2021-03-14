import { CurrencyAmount, TokenAmount } from '@uniswap/sdk'
import { Column, Width } from 'components/grid/Flex'
import { Spinner } from 'components/Spinner'
import Icon from 'components/typography/Icon'
import { formatUnits } from 'ethers/lib/utils'
import { useTokenBalance } from 'hooks/useTokenBalance'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { token0Selector, token1Selector } from 'state/trade'
import { useWallet } from 'use-wallet'
import { Operation } from './Modal'

type Props = {
  operation: Operation
  onAmountChange: (value: string) => void | undefined
  receivedTokenAmount: TokenAmount | CurrencyAmount | null
  loading: boolean
  useWethProxy?: boolean
}

const TokenInput = ({
  operation,
  onAmountChange,
  receivedTokenAmount,
  useWethProxy = true,
}: Props): JSX.Element => {
  const wallet = useWallet()

  const token0 = useRecoilValue(token0Selector)
  const token1 = useRecoilValue(token1Selector)

  const { raw: balance0 } = useTokenBalance(
    token0?.address,
    token0?.decimals,
    wallet.account,
  )
  const { raw: balance1 } = useTokenBalance(
    token1?.address,
    token1?.decimals,
    wallet.account,
  )

  return (
    <React.Suspense fallback={() => <div></div>}>
      <>
        <div className='tokenInputWrapper'>
          <div className='row'>
            <Column width={Width.EIGHT}>
              <div className='numberInput'>
                <span>Amount to {operation}</span>
                <input
                  type='number'
                  placeholder={'0.0'}
                  onInput={(e) => onAmountChange(e.currentTarget.value)}
                />
              </div>
            </Column>
            <Column width={Width.FOUR}>
              <div className='tokenSelector'>
                <span>
                  Balance:{' '}
                  {balance0 && token0 && formatUnits(balance0, token0.decimals)}
                </span>
                <div className='tokenIndicator'>
                  {token0?.logoURI && <Icon src={token0.logoURI}></Icon>}
                  <h2>{token0?.symbol}</h2>
                </div>
              </div>
            </Column>
          </div>

          <div className='row'>
            <Column width={Width.EIGHT}>
              <div className='numberInput'>
                <span>{operation === Operation.Sell ? 'Get' : 'Pay'}</span>
                {receivedTokenAmount !== null ? (
                  <input
                    type='number'
                    placeholder={'0.0'}
                    disabled
                    value={
                      receivedTokenAmount && receivedTokenAmount.toSignificant()
                    }
                  />
                ) : (
                  <div className='spinner'>
                    <Spinner />
                  </div>
                )}
              </div>
            </Column>
            <Column width={Width.FOUR}>
              <div className='tokenSelector'>
                <span>
                  Balance:{' '}
                  {balance1 && token1 && formatUnits(balance1, token1.decimals)}
                </span>
                <div className='tokenIndicator'>
                  {token1?.logoURI && <Icon src={token1.logoURI}></Icon>}
                  <h2>{token1?.symbol}</h2>
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
          }
          .numberInput {
            border-right: 1px solid #332931;
            width: 100%;
            display: flex;
            flex-grow: 1;
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
