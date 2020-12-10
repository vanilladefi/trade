import Link from 'next/link'
import React, { useState } from 'react'
import Gradient from '../../components/backgrounds/gradient'
import { Column, Row, Width } from '../../components/grid/Flex'
import Button from '../../components/input/Button'
import Layout from '../../components/Layout'
import TokenList from '../../components/TokenList'
import HugeMonospace from '../../components/typography/HugeMonospace'
import { Title } from '../../components/typography/Titles'
import Wrapper from '../../components/Wrapper'

type Props = {
  data?: {
    imageUrl: string
    name: string
    ticker: string
    price: string
    marketCap: string
    liquidity: string
    priceChange: number
  }[]
  columns?: {
    Header: string
    accessor: string
  }[]
}

export const HeaderContent: JSX.Element = (
  <>
    <Gradient />
    <Row className='subpageHeader'>
      <Column width={Width.EIGHT}>
        <Title>Start Trading</Title>
        <HugeMonospace>
          Make trades, see your profits blossom and mine VNL.
        </HugeMonospace>
        <Button large>Connect wallet</Button>
      </Column>
    </Row>
    <style jsx>{`
      .subpageHeader {
        --buttonmargin: var(--subpage-buttonmargin);
        --titlemargin: var(--subpage-titlemargin);
      }
    `}</style>
  </>
)

export const BodyContent = (props: Props): JSX.Element => {
  return (
    <Wrapper>
      <Row>
        <Column width={Width.TWELVE}>
          <h1>List of tokens comes here</h1>
          <Link href='/trade/ebin'>Open latest trade</Link>
          <TokenList {...props} />
        </Column>
      </Row>
    </Wrapper>
  )
}

const TradePage = (): JSX.Element => {
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
        Header: 'Logo',
        accessor: 'imageUrl',
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
    ],
    []
  )
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      <Layout title='Trade | Vanilla' hero={HeaderContent}>
        <BodyContent data={data} columns={columns} />
      </Layout>
    </>
  )
}

export default TradePage
