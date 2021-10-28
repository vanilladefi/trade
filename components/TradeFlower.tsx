import dynamic from 'next/dynamic'
import React from 'react'

const Flower = dynamic(import('components/Flower'))

export type Token = {
  symbol: string
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

const TradeFlower: React.FC<Props> = ({
  received,
  reward,
  tradeURL,
  paid,
}: Props) => {
  const receivedData = received && (
    <>
      +{received.amount}
      <br />
      {received.symbol}
    </>
  )

  const rewardData = reward && (
    <>
      +{reward.amount}
      <br />
      {reward.symbol}
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
      {paid.symbol}
    </>
  )

  const rawParticleCount = received
    ? received.amount * 100
    : reward
    ? reward.amount * 100
    : 0
  const particleCount = rawParticleCount > 10000 ? 10000 : rawParticleCount

  return (
    <>
      <div className='tradeWrapper'>
        <Flower
          color={['#000000']}
          minWidth='28vw'
          minHeight='28vw'
          maxWidth='100%'
          maxHeight='100%'
          seed={tradeURL.transactionHash}
          particleCount={particleCount}
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
