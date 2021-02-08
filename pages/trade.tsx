import React, { useCallback, useEffect, useState } from 'react'
import type { GetStaticPropsResult } from 'next'
import { useWallet } from 'use-wallet'
import uniswapTokens from '@uniswap/default-token-list'
import Vibrant from 'node-vibrant'
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
import { AppActions, useWalletState } from 'state/Wallet'
import { thegraphClient, TokenInfoQuery, PairByIdQuery } from 'lib/graphql'
import { ipfsToHttp } from 'lib/ipfs'
import type {
  HandleBuyClick,
  HandleSellClick,
  PairByIdQueryResponse,
  Token,
  TokenInfoQueryResponse,
  UniSwapToken,
} from 'types/trade'
import { chainId } from 'utils/config'
import TradeModal from 'components/Trade/TradeModal'

type PageProps = {
  availableTokens: Token[]
  myTokens: Token[]
}

type BodyProps = {
  availableTokens: Token[]
  myTokens: Token[]
  onBuyClick: HandleBuyClick
  onSellClick: HandleSellClick
}

const HeaderContent = (): JSX.Element => {
  const [, dispatch] = useWalletState()
  const wallet = useWallet()
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
              onClick={() => dispatch({ type: AppActions.OPEN_MODAL })}
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
  availableTokens,
  myTokens,
  onBuyClick,
  onSellClick,
}: BodyProps): JSX.Element => {
  return (
    <Wrapper>
      <Row>
        <Column width={Width.TWELVE}>
          <div className='token-search'>
            <TokenSearch placeholder='Search tokens by name or ticker' />
          </div>

          {myTokens.length && (
            <>
              <h2>MY POSITIONS</h2>
              <MyPositions
                tokens={myTokens}
                onBuyClick={onBuyClick}
                onSellClick={onSellClick}
              />
            </>
          )}

          {availableTokens.length && (
            <>
              <h2>AVAILABLE TOKENS</h2>
              <AvailableTokens
                tokens={availableTokens}
                onBuyClick={onBuyClick}
              />
            </>
          )}
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

export default function TradePage({
  availableTokens,
  myTokens,
}: PageProps): JSX.Element {
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
      const response = await thegraphClient.request(PairByIdQuery, {
        pairId: selectedPairId,
      })
      const pair: PairByIdQueryResponse | null = response?.pairs?.[0] || null
      if (mounted) {
        setLoadingPair(false)
        setSelectedPair(pair)
      }
    }
    getPairData()
    return () => {
      mounted = false
    }
  }, [selectedPairId])

  return (
    <Layout title='Trade | Vanilla' heroRenderer={HeaderContent}>
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
  const WETH = 'WETH'
  const weth = uniswapTokens?.tokens.find(
    (token) => token.chainId === chainId && token.symbol === WETH,
  )

  if (!weth) {
    throw new Error(
      `Unable to find ${WETH} in uniswap list with "chainId": ${chainId}`,
    )
  }

  // Get tokens from Uniswap default-list
  // include only tokens with specified 'chainId' and exclude WETH
  const tokens = uniswapTokens?.tokens.filter(
    (token) => token.chainId === chainId && token.symbol !== weth.symbol,
  )

  // Retrieve more info from The Graph's API
  const response = await thegraphClient.request(TokenInfoQuery, {
    weth: weth.address.toLowerCase(),
    tokenAddresses: tokens.map(({ address }) => address.toLowerCase()),
  })

  const availableTokens = await enrichTokens(tokens, [
    // Merge response arrays
    ...response?.tokensAB,
    ...response?.tokensBA,
  ])

  const myTokens = availableTokens.slice(0, 5)

  return {
    props: {
      availableTokens,
      myTokens,
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
