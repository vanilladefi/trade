import { gql } from 'graphql-request'

export type TokenInfoQueryResponse = {
  token: {
    id: string
  }
  token0Price: string
  reserveUSD: string
}

export const TokenInfoQuery = gql`
  query tokenInfo($weth: String, $tokenAddresses: [String]) {
    tokens: pairs(where: { token0: $weth, token1_in: $tokenAddresses }) {
      token: token1 {
        id
      }
      token0Price
      reserveUSD
    }
  }
`
