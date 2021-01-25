import { gql } from '@apollo/client'
import tokenList from '@uniswap/default-token-list'

export const WETH = tokenList.tokens.find(
  (token) => token.symbol === 'WETH'
) || {
  symbol: 'WETH',
  address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
}

export const WETH_ADDR = WETH.address

export type TokenQueryResponse = {
  id: string
  reserveUSD: string
  token0Price: string
  token0: {
    id: string
  }
  token1: {
    id: string
    name: string
    symbol: string
    __typename: string
  }
  totalSupply: string
  volumeUSD: string
  __typename: string
}

export const GET_TOKEN_INFO = gql`
  query tokenInfo($tokenList: [String]) {
    pairs(
      first: 1000
      where: { token0: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" }
      orderBy: reserveUSD
      orderDirection: desc
    ) {
      id
      token0 {
        id
        name
      }
      token1(where: { id_in: $tokenList }) {
        id
        name
        symbol
      }
      totalSupply
      reserveUSD
      volumeUSD
      token0Price
    }
  }
`

export const GET_MOST_LIQUID_TOKENS = gql`
  query mostLiquid {
    pairs(
      first: 100
      orderBy: reserveETH
      orderDirection: desc
      where: { token0: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" }
    ) {
      id
      token0 {
        id
        name
      }
      token1 {
        id
        name
        symbol
      }
      totalSupply
      reserveUSD
      volumeUSD
      token0Price
    }
  }
`

export const SUBSCRIBE_TO_TOKEN_INFO = gql`
  subscription tokenInfo($wethAddress: Bytes, $tokenList: [String]) {
    pairs(
      where: { token0: { id: $wethAddress }, token1: { symbol_in: $tokenList } }
      orderBy: reserveUSD
      orderDirection: desc
    ) {
      id
      token1 {
        id
        name
        symbol
      }
      totalSupply
      reserveUSD
      volumeUSD
      token0Price
    }
  }
`
