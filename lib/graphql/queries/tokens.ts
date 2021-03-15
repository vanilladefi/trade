import { gql } from 'graphql-request'

const TokenCommonFragment = gql`
  fragment TokenCommonFragment on Pair {
    pairId: id
    reserveUSD
  }
`

const TokenABFragment = gql`
  fragment TokenABFragment on Pair {
    token: token1 {
      id
    }
    price: token0Price
  }
`

const TokenBAFragment = gql`
  fragment TokenBAFragment on Pair {
    token: token0 {
      id
    }
    price: token1Price
  }
`

export const TokenInfoQuery = gql`
  query tokenInfo($weth: String, $tokenAddresses: [String]) {
    tokensAB: pairs(where: { token0: $weth, token1_in: $tokenAddresses }) {
      ...TokenCommonFragment
      ...TokenABFragment
    }
    tokensBA: pairs(where: { token1: $weth, token0_in: $tokenAddresses }) {
      ...TokenCommonFragment
      ...TokenBAFragment
    }
  }
  ${TokenCommonFragment}
  ${TokenABFragment}
  ${TokenBAFragment}
`

export const TokenInfoQueryHistorical = gql`
  query tokenInfo($blockNumber: Int, $weth: String, $tokenAddresses: [String]) {
    tokensAB: pairs(
      block: { number: $blockNumber }
      where: { token0: $weth, token1_in: $tokenAddresses }
    ) {
      ...TokenCommonFragment
      ...TokenABFragment
    }
    tokensBA: pairs(
      block: { number: $blockNumber }
      where: { token1: $weth, token0_in: $tokenAddresses }
    ) {
      ...TokenCommonFragment
      ...TokenBAFragment
    }
  }
  ${TokenCommonFragment}
  ${TokenABFragment}
  ${TokenBAFragment}
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
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
    }
  }
`
