import React from 'react'
import Flower from '../components/Flower'

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
}: Props): JSX.Element => {
  const receivedData = received && (
    <>
      +{received.amount}
      <br />
      {received.ticker}
    </>
  )

  const rewardData = reward && (
    <>
      +{reward.amount}
      <br />
      {reward.ticker}
    </>
  )

  const tradeURLData = tradeURL && (
    <>
      {tradeURL.domain}
      <br />
      {tradeURL.transactionHash}
    </>
  )

  const paidData = paid && (
    <>
      -{paid.amount}
      <br />
      {paid.ticker}
    </>
  )
  return (
    <>
      <div className='tradeWrapper'>
        <Flower
          color={['#000000']}
          minSize='28rem'
          maxSize='100%'
          seed={tradeURL.transactionHash}
          particleCount={
            received ? received.amount * 100 : reward ? reward.amount * 100 : 0
          }
          topLeft={receivedData}
          topRight={rewardData}
          bottomLeft={tradeURLData}
          bottomRight={paidData}
        />
      </div>
      <style jsx>{`
        .tradeWrapper {
          margin: 0 auto;
        }
      `}</style>
    </>
  )
}

export default TradeFlower
