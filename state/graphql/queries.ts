import { gql } from '@apollo/client'
import tokenList from '@uniswap/default-token-list'

export const WETH_ADDR = tokenList.tokens.find(
  (token) => token.symbol === 'WETH'
) || {
  address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
}

export const GET_TOKEN_INFO = gql`
  query tokenInfo($wethAddress: Bytes!) {
    pairs(
      where: { token0: $wethAddress }
      orderBy: reserveUSD
      orderDirection: desc
    ) {
      id
      token1 {
        name
        symbol
      }
      reserveUSD
      volumeUSD
      token0Price
    }
  }
`
