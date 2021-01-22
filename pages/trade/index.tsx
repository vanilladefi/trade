import { useQuery } from '@apollo/client'
import uniswapTokens from '@uniswap/default-token-list'
import Image from 'next/image'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { Cell, Column as TableColumn } from 'react-table'
import { useWallet } from 'use-wallet'
import { TopGradient } from '../../components/backgrounds/gradient'
import { Column, Row, Width } from '../../components/grid/Flex'
import { GridItem, GridTemplate } from '../../components/grid/Grid'
import Button, { ButtonColor, ButtonSize } from '../../components/input/Button'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import TokenList, { TokenInfo } from '../../components/TokenList'
import TradeFlower from '../../components/TradeFlower'
import HugeMonospace from '../../components/typography/HugeMonospace'
import { SmallTitle, Title } from '../../components/typography/Titles'
import Wrapper from '../../components/Wrapper'
import { GET_TOKEN_INFO, TokenQueryResponse } from '../../state/graphql/queries'
import { AppActions, useWalletState } from '../../state/Wallet'

type Props = {
  setTradeModalOpen: Dispatch<SetStateAction<boolean>>
  tradeModalOpen: boolean
}

export const HeaderContent = (): JSX.Element => {
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

export const BodyContent = ({ setTradeModalOpen }: Props): JSX.Element => {
  const { loading, data: tokenList } = useQuery(GET_TOKEN_INFO, {
    variables: {
      tokenList: uniswapTokens.tokens
        .filter((token) => token.symbol !== 'WETH')
        .map((token) => token.address),
    },
  })

  const data: TokenInfo[] = React.useMemo(() => {
    return tokenList
      ? tokenList.pairs
          .filter(
            (pair: TokenQueryResponse) =>
              uniswapTokens &&
              uniswapTokens.tokens &&
              uniswapTokens.tokens.find(
                (token) => token.symbol === pair.token1.symbol
              )
          )
          .map((pair: TokenQueryResponse) => {
            const uniswapSDKMatch =
              uniswapTokens &&
              uniswapTokens.tokens &&
              uniswapTokens.tokens.find(
                (token) => token.symbol === pair.token1.symbol
              )
            return {
              imageUrl: uniswapSDKMatch ? uniswapSDKMatch.logoURI : '',
              name: pair.token1.name,
              ticker: pair.token1.symbol,
              price: parseFloat(pair.token0Price).toFixed(3),
              liquidity: parseFloat(pair.reserveUSD).toFixed(0),
              priceChange: '0',
              token0: pair.token0.id,
              token1: pair.token1.id,
            }
          })
      : []
  }, [tokenList])

  const columns: TableColumn<TokenInfo>[] = React.useMemo<
    TableColumn<TokenInfo>[]
  >(
    () => [
      {
        Header: () => null,
        accessor: 'imageUrl',
        Cell: ({ row }: Cell<TokenInfo>) => {
          return (
            <Image
              src={row.original.imageUrl}
              height='30px'
              width='30px'
              layout={'fixed'}
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
        Header: 'Liquidity',
        accessor: 'liquidity',
        Cell: ({ row }: Cell<TokenInfo>) => {
          return '$' + row.original.liquidity
        },
      },
      {
        Header: 'Change',
        accessor: 'priceChange',
      },
      {
        Header: () => null,
        accessor: 'buy',
        Cell: ({ row }: Cell<TokenInfo>) => (
          <Button
            color={ButtonColor.DARK}
            onClick={() =>
              trade({
                token0: row.original.token0,
                token1: row.original.token1,
              })
            }
          >
            Buy
          </Button>
        ),
      },
    ],
    []
  )

  const trade = (pairInfo: { token0: string; token1: string }) => {
    console.log(pairInfo)
    setTradeModalOpen(true)
  }

  return (
    <Wrapper>
      <Row>
        <Column width={Width.TWELVE}>
          <h2>AVAILABLE TOKENS</h2>
          {/* <span onClick={() => setTradeModalOpen(true)}>Open latest trade</span> */}
          {!loading && <TokenList data={data} columns={columns} />}
        </Column>
      </Row>
    </Wrapper>
  )
}

const TradePage = (): JSX.Element => {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      <Modal open={modalOpen} onRequestClose={() => setModalOpen(false)}>
        <ModalContent />
      </Modal>
      <Layout title='Trade | Vanilla' heroRenderer={HeaderContent}>
        <BodyContent
          setTradeModalOpen={setModalOpen}
          tradeModalOpen={modalOpen}
        />
      </Layout>
    </>
  )
}

export default TradePage
