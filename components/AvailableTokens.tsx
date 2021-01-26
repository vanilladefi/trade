import { useQuery } from '@apollo/client'
import uniswapTokens from '@uniswap/default-token-list'
import Image from 'next/image'
import Vibrant from 'node-vibrant'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Cell } from 'react-table'
import { GET_TOKEN_INFO, TokenQueryResponse } from '../state/graphql/queries'
import Button, { ButtonColor } from './input/Button'
import TokenList, { ColumnWithHide, TokenInfo } from './TokenList'

type Props = {
  setTradeModalOpen: Dispatch<SetStateAction<boolean>>
  tradeModalOpen: boolean
}

const yellowBackground = '#FBF3DB'

const AvailableTokens = ({ setTradeModalOpen }: Props): JSX.Element => {
  const { loading, data: tokenList } = useQuery(GET_TOKEN_INFO, {
    variables: {
      tokenList: uniswapTokens?.tokens
        .filter((token) => token.symbol !== 'WETH')
        .map((token) => token.address),
    },
  })

  const [data, setData] = useState<TokenInfo[]>([])

  const columns: ColumnWithHide<TokenInfo>[] = React.useMemo<
    ColumnWithHide<TokenInfo>[]
  >(
    () => [
      {
        id: 'imageUrl',
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
        id: 'name',
        Header: 'Name',
        accessor: 'name',
        hideBelow: 'md',
      },
      {
        id: 'ticker',
        Header: 'Ticker',
        accessor: 'ticker',
      },
      {
        id: 'price',
        Header: 'Price',
        accessor: 'price',
      },
      {
        id: 'liquidity',
        Header: 'Liquidity',
        accessor: 'liquidity',
        Cell: ({ row }: Cell<TokenInfo>) => {
          return '$' + row.original.liquidity
        },
        hideBelow: 'md',
      },
      {
        id: 'priceChange',
        Header: 'Change',
        accessor: 'priceChange',
      },
      {
        id: 'buy',
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

  useEffect(() => {
    const calculateGradients = async (pairs: TokenInfo[]) => {
      const pairsWithGradients = await Promise.all(
        pairs.map(async (pair) => {
          if (pair.imageUrl && pair.imageUrl !== '') {
            const palette = await Vibrant.from(pair.imageUrl).getPalette()
            const highlightColor =
              palette && palette.LightVibrant
                ? palette.LightVibrant.getHex()
                : yellowBackground
            pair.gradient = `linear-gradient(271.82deg, ${yellowBackground} 78.9%, ${highlightColor} 120%`
          }
          return pair
        })
      )
      setData(pairsWithGradients)
    }
    if (tokenList) {
      const parsedPairs: TokenInfo[] = tokenList.pairs
        .filter(
          (pair: TokenQueryResponse) =>
            uniswapTokens?.tokens.find(
              (token) => token.symbol === pair.token1.symbol
            )
        )
        .map((pair: TokenQueryResponse) => {
          const uniswapSDKMatch = uniswapTokens?.tokens.find(
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
      calculateGradients(parsedPairs)
    }
  }, [tokenList])

  const trade = (pairInfo: { token0: string; token1: string }) => {
    console.log(pairInfo)
    setTradeModalOpen(true)
  }

  return (
    <>
      <h2>AVAILABLE TOKENS</h2>
      {/* <span onClick={() => setTradeModalOpen(true)}>Open latest trade</span> */}
      {!loading && <TokenList data={data} columns={columns} />}
    </>
  )
}

export default AvailableTokens
