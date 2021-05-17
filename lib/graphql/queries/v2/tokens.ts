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
    reserveETH: reserve0
    reserveToken: reserve1
    price: token0Price
  }
`

const TokenBAFragment = gql`
  fragment TokenBAFragment on Pair {
    token: token0 {
      id
    }
    reserveETH: reserve1
    reserveToken: reserve0
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
      reserve: reserve0
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
      reserve: reserve1
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
      reserve0
      reserve1
    }
  }
`

export const TokenDayData = gql`
  query tokenDayData($tokenAddresses: [String]) {
    tokenDayDatas(where: { token_in: $tokenAddresses }) {
      token {
        id
      }
      priceUSD
    }
  }
`

export const ETHPrice = gql`
  query ethPrice {
    bundle(id: 1) {
      ethPrice
    }
  }
`

export const ETHPriceSub = gql`
  subscription ethPrice {
    bundle(id: 1) {
      ethPrice
    }
  }
`
