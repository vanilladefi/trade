import { Column, Width } from 'components/grid/Flex'
import React from 'react'
import { Operation, Token } from 'types/trade'
import SlippageSelector from './SlippageSelector'

type TradeInfoProps = {
  token0: Token | null
  token1: Token | null
  operation: Operation
  price?: string
  tradeValue?: string
  gasEstimate?: string
  feeEstimate?: string
  vnlReward?: {
    vnl: string
    usd: string
  }
}

const TradeInfoDisplay = ({
  token0,
  token1,
  operation,
  price,
  tradeValue,
  gasEstimate,
  feeEstimate,
  vnlReward,
}: TradeInfoProps): JSX.Element => (
  <>
    <Column width={Width.TWELVE}>
      <div className='tradeInfoRow'>
        <span>
          Price per{' '}
          {operation === Operation.Buy ? token1?.symbol : token0?.symbol}
        </span>
        <span>
          {price}{' '}
          {operation === Operation.Buy ? token0?.symbol : token1?.symbol}
        </span>
      </div>
      <div className='tradeInfoRow'>
        <span>Trade value</span>
        <span>{tradeValue} USD</span>
      </div>
      <div className='tradeInfoRow'>
        <span>Estimated gas</span>
        <span>{gasEstimate} ETH</span>
      </div>
      <div className='tradeInfoRow'>
        <span>Liquidity provider fees</span>
        <span>
          {feeEstimate}{' '}
          {operation === Operation.Buy ? token1?.symbol : token0?.symbol}
        </span>
      </div>
      <div className='tradeInfoRow'>
        <span>Slippage tolerance</span>
        <SlippageSelector />
      </div>
      {vnlReward && (
        <div className='tradeInfoRow'>
          <span>Unclaimed rewards</span>
          <span>
            {vnlReward.vnl} VNL <small>${vnlReward.usd}</small>
          </span>
        </div>
      )}
    </Column>
    <style jsx>{`
      div {
        display: flex;
        padding: 1.1rem 1.2rem;
        --bordercolor: var(--toggleWrapperGradient);
      }
      .tradeInfoRow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        border-bottom: 1px solid #d4d4d4;
        padding-left: 0;
        padding-right: 0;
      }
      .tradeInfoRow:last-of-type {
        border-bottom: 0;
      }
      .tradeInfoRow span:last-of-type {
        text-align: right;
      }
    `}</style>
  </>
)

export default TradeInfoDisplay
