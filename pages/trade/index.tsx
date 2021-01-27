import React, { useCallback, useState } from 'react'
import { GetStaticPropsResult } from 'next'
import { useWallet } from 'use-wallet'
import uniswapTokens from '@uniswap/default-token-list'
import Vibrant from 'node-vibrant'
import AvailableTokens from '../../components/AvailableTokens'
import { TopGradient } from '../../components/backgrounds/gradient'
import { Column, Row, Width } from '../../components/grid/Flex'
import { GridItem, GridTemplate } from '../../components/grid/Grid'
import Button, { ButtonSize } from '../../components/input/Button'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import TradeFlower from '../../components/TradeFlower'
import HugeMonospace from '../../components/typography/HugeMonospace'
import { SmallTitle, Title } from '../../components/typography/Titles'
import Wrapper from '../../components/Wrapper'
import { AppActions, useWalletState } from '../../state/Wallet'
import {
  uniswapClient,
  GET_TOKEN_INFO,
  TokenQueryResponse,
} from '../../lib/graphql'
import { TokenInfo } from '../../components/TokenList'
import { HandleTradeClick } from 'types/Trade'

type PageProps = {
  tokenPairs: TokenInfo[]
}

type BodyProps = {
  tokenPairs: TokenInfo[]
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

const BodyContent = ({ tokenPairs, onTradeClick }: BodyProps): JSX.Element => {
  return (
    <Wrapper>
      <Row>
        <Column width={Width.TWELVE}>
          {/* <span onClick={() => onTradeModalOpen(true)}>Open latest trade</span> */}
          {/* <OwnedTokens
            onTradeModalOpen={onTradeModalOpen}
            tradeModalOpen={tradeModalOpen}
          /> */}
          <AvailableTokens
            tokenPairs={tokenPairs}
            onTradeClick={onTradeClick}
          />
        </Column>
      </Row>
    </Wrapper>
  )
}

export default function TradePage({ tokenPairs }: PageProps): JSX.Element {
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
        <BodyContent tokenPairs={tokenPairs} onTradeClick={handleTradeClick} />
      </Layout>
    </>
  )
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PageProps>
> {
  const data = await uniswapClient.request(GET_TOKEN_INFO, {
    tokenList: uniswapTokens?.tokens
      .filter((token) => token.symbol !== 'WETH')
      .map((token) => token.address),
  })

  if (!data) {
    throw new Error('Unable to fetch token listing')
  }

  const parsedPairs = parsePairs(data?.pairs || [])
  const pairsWithGradients = await addGradients(parsedPairs)

  return {
    props: {
      tokenPairs: pairsWithGradients,
    },
    revalidate: 60,
  }
}

// TODO: Figure out an idiomatic position for these 2 functions
function parsePairs(pairs: TokenQueryResponse[]): TokenInfo[] {
  const getUniswapToken = (pair: TokenQueryResponse) =>
    uniswapTokens?.tokens.find((token) => token.symbol === pair.token1.symbol)

  return pairs.filter(getUniswapToken).map((pair: TokenQueryResponse) => {
    const uniswapToken = getUniswapToken(pair)
    return {
      imageUrl: uniswapToken ? uniswapToken.logoURI : '',
      name: pair.token1.name,
      ticker: pair.token1.symbol,
      price: parseFloat(pair.token0Price).toFixed(3),
      liquidity: parseFloat(pair.reserveUSD).toFixed(0),
      priceChange: '0',
      token0: pair.token0.id,
      token1: pair.token1.id,
    }
  })
}

const yellowBackground = '#FBF3DB'

function addGradients(pairs: TokenInfo[]) {
  return Promise.all(
    pairs.map(async (pair) => {
      let gradient
      if (pair?.imageUrl) {
        const palette = await Vibrant.from(pair.imageUrl).getPalette()
        const tokenColor = palette?.LightVibrant?.getHex() ?? yellowBackground
        gradient = `linear-gradient(to right, ${tokenColor} -20%, ${yellowBackground} 20%)`
      }
      return { ...pair, gradient }
    })
  )
}
