import { useQuery } from '@apollo/client'
import uniswapTokens from '@uniswap/default-token-list'
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
import { GET_TOKEN_INFO, TokenQueryResponse } from '../../state/graphql/queries'
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

export const BodyContent = (): JSX.Element => {
  const { loading, error, data: tokenList } = useQuery(GET_TOKEN_INFO, {
    variables: { wethAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' },
  })
  const data = tokenList
    ? tokenList.pairs.filter((pair: TokenQueryResponse) => {
        const uniswapSDKMatch =
          uniswapTokens &&
          uniswapTokens.tokens &&
          uniswapTokens.tokens.find((token) => {
            console.log(token.symbol)
            return token.address === pair.token1.id
          })
        return (
          uniswapSDKMatch && {
            imageUrl: uniswapSDKMatch ? uniswapSDKMatch.logoURI : '',
            name: pair.token1.name,
            ticker: pair.token1.symbol,
            price: parseFloat(pair.token0Price).toFixed(3),
            marketCap: pair.totalSupply,
            liquidity: parseFloat(pair.reserveUSD).toFixed(0),
            priceChange: 0,
          }
        )
      })
    : []

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
  return (
    <Wrapper>
      <Row>
        <Column width={Width.TWELVE}>
          <h1>AVAILABLE TOKENS</h1>
          <Link href='/trade/ebin'>Open latest trade</Link>
          <TokenList data={data} columns={columns} />
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
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      <Layout title='Trade | Vanilla' heroRenderer={HeaderContent}>
        <BodyContent />
      </Layout>
    </>
  )
}

export default TradePage
