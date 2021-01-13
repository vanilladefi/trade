import uniswapTokens from '@uniswap/default-token-list'
import { ChainId, Token } from '@uniswap/sdk'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useWallet } from 'use-wallet'
import Gradient from '../../components/backgrounds/gradient'
import { Column, Row, Width } from '../../components/grid/Flex'
import { GridItem, GridTemplate } from '../../components/grid/Grid'
import Button from '../../components/input/Button'
import Layout from '../../components/Layout'
import TokenList from '../../components/TokenList'
import HugeMonospace from '../../components/typography/HugeMonospace'
import { SmallTitle, Title } from '../../components/typography/Titles'
import Wrapper from '../../components/Wrapper'
import { AppActions, useWalletState } from '../../state/Wallet'

type Props = {
  data: {
    imageUrl: string
    name: string
    ticker: string
    price: string
    marketCap: string
    liquidity: string
    priceChange: number
  }[]
  columns: {
    Header: string
    accessor: string
  }[]
}

export const HeaderContent = (): JSX.Element => {
  const [, dispatch] = useWalletState()
  const wallet = useWallet()
  return (
    <>
      <Gradient />
      <Row className='subpageHeader'>
        {wallet.status !== 'connected' ? (
          <Column width={Width.EIGHT}>
            <Title>Start Trading</Title>
            <HugeMonospace>
              Make trades, see your profits blossom and mine VNL.
            </HugeMonospace>
            <Button
              large
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

export const BodyContent = (props: Props): JSX.Element => {
  return (
    <Wrapper>
      <Row>
        <Column width={Width.TWELVE}>
          <h1>AVAILABLE TOKENS</h1>
          <Link href='/trade/ebin'>Open latest trade</Link>
          <TokenList {...props} />
        </Column>
      </Row>
      <style jsx>{`
        h1 {
          font-size: 33px;
          text-transform: uppercase;
        }
      `}</style>
    </Wrapper>
  )
}

const TradePage = (): JSX.Element => {
  const tokenList = React.useMemo(() => {
    const jsonToArray = uniswapTokens.tokens.map(
      (token) =>
        new Token(
          ChainId.MAINNET,
          token.address,
          token.decimals,
          token.symbol,
          token.name
        )
    )
    return jsonToArray
  }, [])
  console.log(tokenList)
  /* const tokenInfo = Promise.all(
    tokenList.map((token) =>
      Fetcher.fetchPairData(WETH[ChainId.MAINNET], token)
    )
  )
  console.log(tokenInfo) */
  const data = React.useMemo(
    () => [
      {
        imageUrl: '/images/uniswap.png',
        name: 'Uniswap',
        ticker: 'UNI',
        price: '$447.63',
        marketCap: '$1,000,000,000',
        liquidity: '$26,364,263',
        priceChange: -1.25,
      },
      {
        imageUrl: '/images/uniswap.png',
        name: 'Uniswap',
        ticker: 'UNI',
        price: '$447.63',
        marketCap: '$1,000,000,000',
        liquidity: '$26,364,263',
        priceChange: -1.25,
      },
      {
        imageUrl: '/images/uniswap.png',
        name: 'Uniswap',
        ticker: 'UNI',
        price: '$447.63',
        marketCap: '$1,000,000,000',
        liquidity: '$26,364,263',
        priceChange: -1.25,
      },
    ],
    []
  )
  const columns = React.useMemo(
    () => [
      {
        Header: (): any => null,
        accessor: 'imageUrl',
        Cell: ({ row }) => {
          return (
            <Image
              src={row.cells[0].value}
              height='30px'
              width='30px'
              layout='fixed'
            />
          )
        },
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Ticker',
        accessor: 'ticker',
      },
      {
        Header: 'Price',
        accessor: 'price',
      },
      {
        Header: 'Market Cap',
        accessor: 'marketCap',
      },
      {
        Header: 'Liquidity',
        accessor: 'liquidity',
      },
      {
        Header: 'Change',
        accessor: 'priceChange',
      },
      {
        Header: () => null,
        accessor: 'buy',
        Cell: () => <Button>Buy</Button>,
      },
    ],
    []
  )
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      <Layout title='Trade | Vanilla' heroRenderer={HeaderContent}>
        <BodyContent data={data} columns={columns} />
      </Layout>
    </>
  )
}

export default TradePage
