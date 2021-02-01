import { gql } from 'graphql-request'

export const TokenInfoQuery = gql`
  query tokenInfo($weth: String, $tokenAddresses: [String]) {
    tokensAB: pairs(where: { token0: $weth, token1_in: $tokenAddresses }) {
      id
      token: token1 {
        id
      }
      price: token0Price
      reserveUSD
    }
    tokensBA: pairs(where: { token1: $weth, token0_in: $tokenAddresses }) {
      id
      token: token0 {
        id
      }
      price: token1Price
      reserveUSD
    }
  }
`

export const PairByIdQuery = gql`
  query tokenInfo($pairId: String) {
    pairs(where: { id: $pairId }) {
      id
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
    }
  }
`
