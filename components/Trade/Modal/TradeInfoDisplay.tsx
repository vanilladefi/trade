import { Column, Width } from 'components/grid/Flex'
import useTradeEngine from 'hooks/useTradeEngine'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { currentETHPrice } from 'state/meta'
import { selectedOperation } from 'state/trade'
import { VanillaVersion } from 'types/general'
import { Operation } from 'types/trade'
import SlippageSelector from './SlippageSelector'

type TradeInfoProps = {
  version: VanillaVersion
}

const TradeInfoDisplay = ({ version }: TradeInfoProps): JSX.Element => {
  const {
    token0,
    token1,
    estimatedReward,
    estimatedRewardInUsd,
    estimatedFees,
    estimatedGas,
    trade,
  } = useTradeEngine(version)
  const ethUsdPrice = useRecoilValue(currentETHPrice)
  const operation = useRecoilValue(selectedOperation)

  return (
    <>
      <Column width={Width.TWELVE}>
        <div className='tradeInfoRow'>
          <span>
            Price per{' '}
            {operation === Operation.Buy ? token1?.symbol : token0?.symbol}
          </span>
          <span>
            {trade?.executionPrice.toSignificant()}{' '}
            {operation === Operation.Buy ? token0?.symbol : token1?.symbol}
          </span>
        </div>
        <div className='tradeInfoRow'>
          <span>Trade value</span>
          <span>
            {trade && operation === Operation.Buy
              ? (
                  parseFloat(trade?.inputAmount.toSignificant()) * ethUsdPrice
                ).toLocaleString('en-US')
              : trade &&
                (
                  parseFloat(trade?.outputAmount.toSignificant()) * ethUsdPrice
                ).toLocaleString('en-US')}{' '}
            USD
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
            {operation === Operation.Buy ? token1?.symbol : token0?.symbol}
          </span>
        </div>
        <div className='tradeInfoRow'>
          <span>Slippage tolerance</span>
          <SlippageSelector />
        </div>
        {estimatedReward && (
          <div className='tradeInfoRow'>
            <span>Unclaimed rewards</span>
            <span>
              {estimatedReward} VNL <small>${estimatedRewardInUsd()}</small>
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
}

export default TradeInfoDisplay
