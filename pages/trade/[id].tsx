import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { Column, Row, Width } from '../../components/grid/Flex'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import TokenList from '../../components/TokenList'
import TradeFlower from '../../components/TradeFlower'
import { SmallTitle } from '../../components/typography/Titles'
import Wrapper from '../../components/Wrapper'
import { HeaderContent } from './'

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
      <style jsx>{`
        h1 {
          font-size: 33px;
          text-transform: uppercase;
        }
      `}</style>
    </Wrapper>
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
        padding: 19px 17px;
        justify-content: space-between;
      }
    `}</style>
  </Column>
)

const Trade = (): JSX.Element => {
  const router = useRouter()
  const { id } = router.query
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
  return (
    <>
      <Modal open={!!id} onRequestClose={() => router.push('/trade')}>
        <ModalContent />
      </Modal>
      <Layout title='Trade | Vanilla' hero={HeaderContent}>
        <BodyContent data={data} columns={columns} />
      </Layout>
    </>
  )
}

export default Trade
