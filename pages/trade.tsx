import React, { useCallback, useState } from 'react'
import { GetStaticPropsResult } from 'next'
import { useWallet } from 'use-wallet'
import uniswapTokens from '@uniswap/default-token-list'
import Vibrant from 'node-vibrant'
import TokenList from 'components/TokenList'
import { TopGradient } from 'components/backgrounds/gradient'
import { Column, Row, Width } from 'components/grid/Flex'
import { GridItem, GridTemplate } from 'components/grid/Grid'
import Button, { ButtonSize } from 'components/input/Button'
import Layout from 'components/Layout'
import Modal from 'components/Modal'
import TradeFlower from 'components/TradeFlower'
import HugeMonospace from 'components/typography/HugeMonospace'
import { SmallTitle, Title } from 'components/typography/Titles'
import Wrapper from 'components/Wrapper'
import { AppActions, useWalletState } from 'state/Wallet'
import {
  thegraphClient,
  TokenInfoQuery,
  TokenInfoQueryResponse,
} from 'lib/graphql'
import { HandleTradeClick, UniSwapToken, Token } from 'types/Trade'

type PageProps = {
  tokens: Token[]
}

type BodyProps = {
  tokens: Token[]
  onTradeClick: HandleTradeClick
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

const BodyContent = ({ tokens, onTradeClick }: BodyProps): JSX.Element => {
  return (
    <Wrapper>
      <Row>
        <Column width={Width.TWELVE}>
          {/* <span onClick={() => onTradeModalOpen(true)}>Open latest trade</span> */}
          {/* <OwnedTokens
            onTradeModalOpen={onTradeModalOpen}
            tradeModalOpen={tradeModalOpen}
          /> */}
          <h2>AVAILABLE TOKENS</h2>
          <TokenList tokens={tokens} onTradeClick={onTradeClick} />
        </Column>
      </Row>
    </Wrapper>
  )
}

export default function TradePage({ tokens }: PageProps): JSX.Element {
  const [modalOpen, setModalOpen] = useState(false)

  const handleTradeClick = useCallback((pairInfo) => {
    console.log(pairInfo)
    setModalOpen(true)
  }, [])

  return (
    <>
      <Modal open={modalOpen} onRequestClose={() => setModalOpen(false)}>
        <ModalContent />
      </Modal>
      <Layout title='Trade | Vanilla' heroRenderer={HeaderContent}>
        <BodyContent tokens={tokens} onTradeClick={handleTradeClick} />
      </Layout>
    </>
  )
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PageProps>
> {
  // TODO: Should this be configurable?
  const chainId = 1

  // TODO: Should this be configurable?
  const weth = {
    symbol: 'WETH',
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  }

  // Get tokens from Uniswap default-list
  // include only tokens with specified 'chainId' and exclude WETH
  const tokens: UniSwapToken[] = uniswapTokens?.tokens.filter(
    (token) => token.chainId === chainId && token.symbol !== weth.symbol
  )

  // Retrieve more info from The Graph's API
  const data = await thegraphClient.request(TokenInfoQuery, {
    weth: weth.address,
    tokenAddresses: tokens.map(({ address }) => address.toLowerCase()),
  })

  return {
    props: {
      tokens: await enrichTokens(tokens, data?.tokens),
    },
    revalidate: 60,
  }
}

function enrichTokens(
  tokens: UniSwapToken[],
  data: TokenInfoQueryResponse[] | undefined = [],
  defaultColor = '#FBF3DB'
): Promise<Token[]> {
  return Promise.all(
    tokens.map(async (t) => {
      // Add data from API
      const fromAPI = data.find((d) => d?.token.id === t.address)

      const price = fromAPI?.token0Price
        ? parseFloat(fromAPI.token0Price)
        : null

      const liquidity = fromAPI?.reserveUSD
        ? parseFloat(fromAPI.reserveUSD)
        : null

      const logoURI = ipfsToHttp(t.logoURI)

      // Add a gradient color based tokens logo
      let gradient = null
      try {
        const palette = await Vibrant.from(logoURI).getPalette()
        const color = palette?.LightVibrant?.getHex() ?? defaultColor
        gradient = `linear-gradient(to right, ${color} -20%, ${defaultColor} 20%)`
      } catch (e) {}

      return {
        ...t,
        price,
        priceChange: 0,
        liquidity,
        logoURI,
        gradient,
      }
    })
  )
}

function ipfsToHttp(src: string | undefined, gateway = 'ipfs.io/ipfs') {
  if (!src) return ''
  return src.replace('ipfs://', `https://${gateway}/`)
}
