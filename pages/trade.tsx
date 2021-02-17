import React, { useCallback, useEffect, useState } from 'react'
import type { GetStaticPropsResult } from 'next'
import { useWallet } from 'use-wallet'
import { useSetRecoilState } from 'recoil'
import { walletModalOpenState } from 'state/wallet'
import { AvailableTokens, MyPositions } from 'components/Trade'
import TokenSearch from 'components/TokenSearch'
import { TopGradient } from 'components/backgrounds/gradient'
import { Column, Row, Width } from 'components/grid/Flex'
import Button, { ButtonSize } from 'components/input/Button'
import Layout from 'components/Layout'
import Modal from 'components/Modal'
import TradeFlower from 'components/TradeFlower'
import HugeMonospace from 'components/typography/HugeMonospace'
import { SmallTitle, Title } from 'components/typography/Titles'
import Wrapper from 'components/Wrapper'
import { thegraphClient, PairByIdQuery } from 'lib/graphql'
import type {
  HandleBuyClick,
  HandleSellClick,
  PairByIdQueryResponse,
  Token,
} from 'types/trade'
import { allTokensStoreState } from 'state/tokens'
import { addGraphInfo, addLogoColor, getAllTokens } from 'lib/tokens'
import { getCurrentBlockNumber, getAverageBlockCountPerHour } from 'lib/block'
import useTokenSubscription from 'hooks/useTokenSubscription'
import useMetaSubscription from 'hooks/useMetaSubscription'

type PageProps = {
  allTokens: Token[]
}

type BodyProps = {
  allTokens: Token[]
  onBuyClick: HandleBuyClick
  onSellClick: HandleSellClick
}

const HeaderContent = (): JSX.Element => {
  const wallet = useWallet()
  const setWalletModalOpen = useSetRecoilState(walletModalOpenState)

  return (
    <>
      <TopGradient />
      <Row className='subpageHeader'>
        {wallet.status !== 'connected' ? (
          <Column width={Width.EIGHT}>
            <Title>Start Trading</Title>
            <HugeMonospace>
              Make trades, see your profits blossom and mine VNL.
            </HugeMonospace>
            <Button
              size={ButtonSize.LARGE}
              onClick={() => {
                setWalletModalOpen(true)
              }}
            >
              Connect wallet
            </Button>
          </Column>
        ) : (
          <Column width={Width.TWELVE}>
            <Title>My trading</Title>
            <div className='stats-grid'>
              <div className='stats-grid-item'>
                <h2 className='title'>TOTAL BALANCE</h2>
                <h3 className='subTitle'>$324</h3>
                <span className='details'>5.1275 ETH (+4%)</span>
              </div>
              <div className='stats-grid-item'>
                <h2 className='title'>PROFITABLE POSITIONS</h2>
                <h3 className='subTitle'>24/34</h3>
              </div>
              <div className='stats-grid-item'>
                <h2 className='title'>UNREALIZED PROFIT</h2>
                <h3 className='subTitle'>12%</h3>
                <span className='details'>1.15 VNL</span>
              </div>
            </div>
          </Column>
        )}
      </Row>
      <style jsx global>{`
        .subpageHeader {
          --buttonmargin: var(--subpage-buttonmargin);
          --titlemargin: var(--subpage-titlemargin);
        }

        .stats-grid {
          width: 100%;
          display: grid;
          gap: 70px;
          grid: auto / 1fr 1fr 1fr;
          margin-bottom: 2rem;
        }
        .stats-grid .title,
        .stats-grid .subTitle,
        .stats-grid .details {
          font-size: 1.1rem;
          font-family: var(--monofont);
          font-weight: var(--monoweight)
          line-height: 1em;
          margin: 0;
          padding: 0;
        }

        .stats-grid-item {
          width: 100%;
          display: grid;
          grid:
            "title" auto
            "subTitle" auto
            "details" 26px
            / auto
        }

        .stats-grid .title {
          grid-area: title;
          font-weight: var(--titleweight);
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(44, 25, 41, .4)
        }

        .stats-grid .subTitle {
          grid-area: subTitle;
          font-size: 1.8rem;
        }

        .stats-grid .details {
          grid-area: details;
        }

        @media(max-width: 680px){
          .stats-grid {
            gap: 0;
            grid: auto / auto;
          }
          .stats-grid-item:first-child {
            border-top: 1px solid rgba(44, 25, 41, .4);
          }
          .stats-grid-item {
            grid:
              "title subTitle" 1fr
              "title details" auto
              / 1fr 1fr;
            padding: 2rem 0;
            border-bottom: 1px solid rgba(44, 25, 41, .4);
          }
          .stats-grid .title {
            align-self: center;
            font-size: 1.5rem;
            padding-bottom: 0;
            margin-bottom: 0;
            border: none;
          }
          .stats-grid .subTitle,
          .stats-grid .details {
            align-self: center;
            justify-self: end;
            text-align: right;
          }
          .stats-grid .subTitle {
            font-size: 2.2rem;
          }
          .stats-grid .details {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </>
  )
}

const ModalContent = (): JSX.Element => (
  <Column>
    <div>
      <SmallTitle>TRADE SUCCESSFUL!</SmallTitle>
    </div>
    <TradeFlower
      received={{ ticker: 'DAI', amount: 2.5 }}
      paid={{ ticker: 'ETH', amount: 0.0056572 }}
      tradeURL={{
        domain: 'vnl.com',
        transactionHash:
          '0x05c7cedb4b6a234a92fcc9e396661cbed6d89e301899af6569dae3ff32a48acb',
      }}
    />
    <div>
      <Column>
        <SmallTitle>Share for more VNL</SmallTitle>
        <span>Learn more</span>
      </Column>
      <span>links here</span>
    </div>
    <style jsx>{`
      div {
        display: flex;
        flex-direction: row;
        padding: 1.1rem 1.2rem;
        justify-content: space-between;
      }
    `}</style>
  </Column>
)

const BodyContent = ({
  allTokens,
  onBuyClick,
  onSellClick,
}: BodyProps): JSX.Element => {
  useMetaSubscription()
  useTokenSubscription()
  const setTokens = useSetRecoilState(allTokensStoreState)

  useEffect(() => {
    setTokens(allTokens)
  }, [setTokens, allTokens])

  return (
    <Wrapper>
      <Row>
        <Column width={Width.TWELVE}>
          <div className='token-search'>
            <TokenSearch placeholder='Search tokens by name or ticker' />
          </div>

          <h2>MY POSITIONS</h2>
          <MyPositions onBuyClick={onBuyClick} onSellClick={onSellClick} />

          <h2>AVAILABLE TOKENS</h2>
          {/* Pass "initialTokens" so this page is statically rendered with tokens */}
          <AvailableTokens initialTokens={allTokens} onBuyClick={onBuyClick} />
        </Column>
      </Row>
      <style jsx>{`
        .token-search {
          width: calc(100% + 2 * var(--outermargin));
          margin-left: calc(-1 * var(--outermargin));
          padding: 0.7rem 1rem;
          border-bottom: 2px solid #f2f0e9;
        }
      `}</style>
    </Wrapper>
  )
}

export default function TradePage({ allTokens }: PageProps): JSX.Element {
  // NOTE: allTokens here will be stale after a while
  // allTokens here is only used to populate the state on first render (static)
  // Updates to allTokens happen in recoil
  // Recoil can not be used here as this is outside of recoilRoot
  // because this is a page component

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPairId, setSelectedPairId] = useState('')
  const [, setLoadingPair] = useState(false)
  const [, setSelectedPair] = useState<PairByIdQueryResponse | null>(null)

  const handleBuyClick: HandleBuyClick = useCallback((pairInfo) => {
    setSelectedPairId(pairInfo?.pairId ?? '')
    setModalOpen(true)
  }, [])

  const handleSellClick: HandleSellClick = useCallback((pairInfo) => {
    setSelectedPairId(pairInfo?.pairId ?? '')
    setModalOpen(true)
  }, [])

  // Retrieve pair info from The Graph when 'selectedPairId' changes
  useEffect(() => {
    let mounted = true
    const getPairData = async () => {
      if (mounted) setLoadingPair(true)
      let pair: PairByIdQueryResponse | null = null
      try {
        const response = await thegraphClient.request(PairByIdQuery, {
          pairId: selectedPairId,
        })
        pair = response?.pairs?.[0] || null
      } catch (e) {
      } finally {
        if (mounted) {
          setLoadingPair(false)
          setSelectedPair(pair)
        }
      }
    }
    if (selectedPairId) getPairData()
    return () => {
      mounted = false
    }
  }, [selectedPairId])

  return (
    <Layout
      title='Start trading'
      description='Make trades, see your profits blossom and mine VNL.'
      shareImg='/social/social-share-trade.png'
      heroRenderer={HeaderContent}
    >
      <Modal open={modalOpen} onRequestClose={() => setModalOpen(false)}>
        <ModalContent />
      </Modal>
      <BodyContent
        allTokens={allTokens}
        onBuyClick={handleBuyClick}
        onSellClick={handleSellClick}
      />
    </Layout>
  )
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PageProps>
> {
  let tokens = getAllTokens()
  tokens = await addLogoColor(tokens)

  // Fetch these simultaneously
  const [blocksPerHour, currentBlockNumber, _tokens] = await Promise.all([
    getAverageBlockCountPerHour(),
    getCurrentBlockNumber(),
    addGraphInfo(tokens),
  ])

  const block24hAgo = currentBlockNumber - 24 * blocksPerHour

  // Add historical data (price change)
  if (block24hAgo > 0) {
    tokens = await addGraphInfo(_tokens, block24hAgo)
  } else {
    tokens = _tokens
  }

  return {
    props: {
      allTokens: tokens,
    },
    revalidate: 60,
  }
}
