import { useQuery } from '@apollo/client'
import uniswapTokens from '@uniswap/default-token-list'
import Image from 'next/image'
import { default as Vibrant } from 'node-vibrant'
import {
  default as React,
  Dispatch,
  SetStateAction,
  useEffect,
  useState
} from 'react'
import { Cell } from 'react-table'
import Button, { ButtonColor } from '../../components/input/Button'
import TokenList, {
  ColumnWithHide,
  TokenInfo
} from '../../components/TokenList'
import { GET_TOKEN_INFO, TokenQueryResponse } from '../../state/graphql/queries'

type Props = {
  setTradeModalOpen: Dispatch<SetStateAction<boolean>>
  tradeModalOpen: boolean
}

const yellowBackground = '#FBF3DB'

const AvailableTokens = ({ setTradeModalOpen }: Props): JSX.Element => {
  const { loading, data: tokenList } = useQuery(GET_TOKEN_INFO, {
    variables: {
      tokenList: uniswapTokens.tokens
        .filter((token) => token.symbol !== 'WETH')
        .map((token) => token.address),
    },
  })

  const [data, setData] = useState<TokenInfo[]>([])

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
            const gradient = `linear-gradient(271.82deg, ${yellowBackground} 78.9%, ${highlightColor} 120%`
            pair = Object.assign(pair, { gradient: gradient })
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
      calculateGradients(parsedPairs)
    }
  }, [tokenList])

  const columns: ColumnWithHide<TokenInfo>[] = React.useMemo<
    ColumnWithHide<TokenInfo>[]
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
        hideBelow: 'md',
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
        hideBelow: 'md',
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
    <>
      <h2>AVAILABLE TOKENS</h2>
      {/* <span onClick={() => setTradeModalOpen(true)}>Open latest trade</span> */}
      {!loading && <TokenList data={data} columns={columns} />}
    </>
  )
}

export default AvailableTokens
