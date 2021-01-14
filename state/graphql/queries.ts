import { gql } from '@apollo/client'
import tokenList from '@uniswap/default-token-list'

export const WETH_ADDR = tokenList.tokens.find(
  (token) => token.symbol === 'WETH'
) || {
  address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
}

export type TokenQueryResponse = {
  id: string
  reserveUSD: string
  token0Price: string
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
  query tokenInfo($wethAddress: Bytes!) {
    pairs(
      where: { token0: $wethAddress }
      first: 100
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

export const SUBSCRIBE_TO_TOKEN_INFO = gql`
  subscription tokenInfo($wethAddress: Bytes!) {
    pairs(
      where: { token0: $wethAddress }
      first: 100
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
