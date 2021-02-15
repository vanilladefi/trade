import { CurrencyAmount, Token } from '@uniswap/sdk'
import { getERC20TokenBalance, tokenListChainId } from 'lib/tokens'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState } from 'state/wallet'
import { PairByIdQueryResponse } from 'types/trade'
import { useWallet } from 'use-wallet'
import { Operation } from './Modal'

type Props = {
  operation: Operation
  onAmountChange: (value: string) => void | undefined
  token0In?: CurrencyAmount | undefined
  token1Out?: number | undefined
  selectedPair: PairByIdQueryResponse | null
}

const TokenInput = ({
  operation,
  onAmountChange,
  //token0In,
  token1Out,
  selectedPair,
}: Props): JSX.Element => {
  const provider = useRecoilValue(providerState)
  const wallet = useWallet()

  const [balance0, setBalance0] = useState(0)
  const [balance1, setBalance1] = useState(0)

  useEffect(() => {
    if (provider && selectedPair && wallet.account) {
      const token0 = new Token(
        tokenListChainId,
        selectedPair?.token0.id,
        parseInt(selectedPair.token0.decimals),
      )
      const token1 = new Token(
        tokenListChainId,
        selectedPair?.token0.id,
        parseInt(selectedPair.token0.decimals),
      )
      getERC20TokenBalance(wallet.account, token0, provider).then(setBalance0)
      getERC20TokenBalance(wallet.account, token1, provider).then(setBalance1)
    }
  }, [provider, selectedPair, wallet.account])

  return (
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
          </div>
        </div>

        <div className='row'>
          <div className='numberInput'>
            <span>{operation === Operation.Sell ? 'Get' : 'Pay'}</span>
            <input
              className='input'
              type='number'
              placeholder={'0.0'}
              value={token1Out?.toString()}
            />
          </div>
          <div className='tokenSelector'>
            <span>Balance: {balance1}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tokenInputWrapper {
          border-radius: 1.5rem;
          border: 2px solid var(--dark);
          width: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .row {
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
          flex-shrink: 1;
          padding: 1rem 1.2rem;
        }
        .numberInput {
          flex-grow: 1;
          border-right: 1px solid #332931;
        }
        .input {
          border: 0;
          background: transparent;
          outline: 0;
          font-family: var(--monofont);
          font-weight: var(--monoweight);
          font-size: var(--hugemonosize);
        }
      `}</style>
    </>
  )
}

export default TokenInput
