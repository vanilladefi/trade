import React from 'react'

export type Token = {
  ticker: string
  amount: number
}

export type TradeURL = {
  domain: string
  transactionHash: string
}

type Props = {
  received?: Token
  reward?: Token
  tradeURL: TradeURL
  paid?: Token
}

const TradeFlower = ({
  received,
  reward,
  tradeURL,
  paid,
}: Props): JSX.Element => (
  <>
    <div className='tradeWrapper'>
      <section className='row'>
        {received && (
          <div className='col left'>
            <span>+{received.amount}</span>
            <span>{received.ticker}</span>
          </div>
        )}
        {reward && (
          <div className='col right'>
            <span>+{reward.amount}</span>
            <span>{reward.ticker}</span>
          </div>
        )}
      </section>
      <section className='row'>
        {tradeURL && (
          <div className='col left'>
            <span>{tradeURL.domain}</span>
            <span>{tradeURL.transactionHash}</span>
          </div>
        )}
        {paid && (
          <div className='col right'>
            <span>-{paid.amount}</span>
            <span>{paid.ticker}</span>
          </div>
        )}
      </section>
    </div>
    <style jsx>{`
      div.tradeWrapper {
        display: flex;
        flex-direction: column;
        align-items: space-between;
        justify-content: space-between;
        background: var(--tradeflowergradient);
        border-radius: var(--tradeflowerborderradius);
        padding: var(--tradeflowerpadding);
        width: 100%;
        height: 426px;
      }
      div.row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      div.col {
        display: flex;
        flex-direction: column;
      }
      div.left {
        align-items: flex-start;
        max-width: 50%;
        position: relative;
      }
      div.right {
        align-items: flex-end;
        max-width: 50%;
        position: relative;
      }
      span {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `}</style>
  </>
)

export default TradeFlower
