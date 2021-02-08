import React, { useCallback, useEffect, useState } from 'react'
import type { GetStaticPropsResult } from 'next'
import { useWallet } from 'use-wallet'
import { useSetRecoilState } from 'recoil'
import { walletModalOpenState } from 'state/wallet'
import { AvailableTokens, MyPositions } from 'components/Trade'
import TokenSearch from 'components/TokenSearch'
import { TopGradient } from 'components/backgrounds/gradient'
import { Column, Row, Width } from 'components/grid/Flex'
import { GridItem, GridTemplate } from 'components/grid/Grid'
import Button, { ButtonSize } from 'components/input/Button'
import Layout from 'components/Layout'
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
import useTokenSubscription from 'hooks/useTokenSubscription'
import { chainId } from 'utils/config'
import TradeModal from 'components/Trade/TradeModal'

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
            <GridTemplate>
              <GridItem>
                <Column>
                  <SmallTitle>TOTAL BALANCE</SmallTitle>
                  <h1>Amountenings $</h1>
                  <span>this is the subtitle</span>
                </Column>
              </GridItem>
              <GridItem>
                <Column>
                  <SmallTitle>PROFITABLE POSITIONS</SmallTitle>
                  <h1>24/34</h1>
                </Column>
              </GridItem>
              <GridItem>
                <Column>
                  <SmallTitle>UNREALIZED PROFIT</SmallTitle>
                  <h1>12%</h1>
                  <span>1.15 VNL</span>
                </Column>
              </GridItem>
            </GridTemplate>
          </Column>
        )}
      </Row>
      <style jsx global>{`
        .subpageHeader {
          --buttonmargin: var(--subpage-buttonmargin);
          --titlemargin: var(--subpage-titlemargin);
        }
      `}</style>
    </>
  )
}

const BodyContent = ({
  allTokens,
  onBuyClick,
  onSellClick,
}: BodyProps): JSX.Element => {
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
          <AvailableTokens onBuyClick={onBuyClick} />
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
      <TradeModal open={modalOpen} onRequestClose={() => setModalOpen(false)} />
      <BodyContent
        availableTokens={availableTokens}
        myTokens={myTokens}
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
  tokens = await addGraphInfo(tokens)
  return {
    props: {
      allTokens: tokens,
    },
    revalidate: 60,
  }
}

function enrichTokens(
  tokens: UniSwapToken[],
  data: TokenInfoQueryResponse[] | undefined = [],
): Promise<Token[]> {
  return Promise.all(
    tokens.map(async (t) => {
      // Add data from API
      const pair = data.find(
        (d) => d?.token.id.toLowerCase() === t.address.toLowerCase(),
      )

      const logoURI = ipfsToHttp(t.logoURI)

      // Add a color based on tokens logo
      let logoColor = null
      try {
        const palette = await Vibrant.from(logoURI).getPalette()
        logoColor = palette?.LightVibrant?.getHex() || null
      } catch (e) {}

      return {
        ...t,
        pairId: pair?.id ?? null,
        price: pair?.price ? parseFloat(pair.price) : null,
        liquidity: pair?.reserveUSD ? parseFloat(pair.reserveUSD) : null,
        priceChange: 0,
        logoURI,
        logoColor,
      }
    }),
  )
}
