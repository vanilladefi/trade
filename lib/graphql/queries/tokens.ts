import { gql } from 'graphql-request'

export const TokenInfoQuery = gql`
  query tokenInfo($weth: String, $tokenAddresses: [String]) {
    tokensAB: pairs(where: { token0: $weth, token1_in: $tokenAddresses }) {
      pairId: id
      reserveUSD
      token: token1 {
        id
      }
      price: token0Price
    }
    tokensBA: pairs(where: { token1: $weth, token0_in: $tokenAddresses }) {
      pairId: id
      reserveUSD
      token: token0 {
        id
      }
      price: token1Price
    }
  }
`

export const TokenInfoSubAB = gql`
  subscription tokenInfoAB($weth: String, $tokenAddresses: [String]) {
    tokens: pairs(where: { token0: $weth, token1_in: $tokenAddresses }) {
      pairId: id
      reserveUSD
      token: token1 {
        id
      }
      price: token0Price
    }
  }
`

export const TokenInfoSubBA = gql`
  subscription tokenInfoBA($weth: String, $tokenAddresses: [String]) {
    tokens: pairs(where: { token1: $weth, token0_in: $tokenAddresses }) {
      pairId: id
      reserveUSD
      token: token0 {
        id
      }
      price: token1Price
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
