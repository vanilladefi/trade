import { gql } from 'graphql-request'

const TokenCommonFragment = gql`
  fragment TokenCommonFragment on Pool {
    pairId: id
    inRangeLiquidity: liquidity
    feeTier
    sqrtPrice
  }
`

const TokenABFragment = gql`
  fragment TokenABFragment on Pool {
    token: token1 {
      id
      symbol
      name
      decimals
    }
    liquidity: totalValueLockedUSD
    price: token0Price
  }
`

const TokenBAFragment = gql`
  fragment TokenBAFragment on Pool {
    token: token0 {
      id
      symbol
      name
      decimals
    }
    liquidity: totalValueLockedUSD
    price: token1Price
  }
`

export const TokenInfoQuery = gql`
  query tokenInfo(
    $weth: String
    $tokenAddresses: [String]
    $poolAddresses: [String]
  ) {
    tokensAB: pools(
      where: {
        token0: $weth
        token1_in: $tokenAddresses
        id_in: $poolAddresses
      }
    ) {
      ...TokenCommonFragment
      ...TokenABFragment
    }
    tokensBA: pools(
      where: {
        token1: $weth
        token0_in: $tokenAddresses
        id_in: $poolAddresses
      }
    ) {
      ...TokenCommonFragment
      ...TokenBAFragment
    }
  }
  ${TokenCommonFragment}
  ${TokenABFragment}
  ${TokenBAFragment}
`

export const TokenInfoQueryHistorical = gql`
  query tokenInfo(
    $blockNumber: Int
    $weth: String
    $tokenAddresses: [String]
    $poolAddresses: [String]
  ) {
    tokensAB: pools(
      block: { number: $blockNumber }
      where: {
        token0: $weth
        token1_in: $tokenAddresses
        id_in: $poolAddresses
      }
    ) {
      ...TokenCommonFragment
      ...TokenABFragment
    }
    tokensBA: pools(
      block: { number: $blockNumber }
      where: {
        token1: $weth
        token0_in: $tokenAddresses
        id_in: $poolAddresses
      }
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
  subscription tokenInfoAB(
    $weth: String
    $tokenAddresses: [String]
    $poolAddresses: [String]
  ) {
    tokens: pools(
      where: {
        token0: $weth
        token1_in: $tokenAddresses
        id_in: $$poolAddresses
      }
    ) {
      pairId: id
      liquidity: totalValueLockedUSD
      inRangeLiquidity: liquidity
      feeTier
      sqrtPrice
      token: token1 {
        id
        symbol
        name
        decimals
      }
      price: token0Price
    }
  }
`

export const TokenInfoSubBA = gql`
  subscription tokenInfoBA(
    $weth: String
    $tokenAddresses: [String]
    $poolAddresses: [String]
  ) {
    tokens: pools(
      where: {
        token1: $weth
        token0_in: $tokenAddresses
        id_in: $$poolAddresses
      }
    ) {
      pairId: id
      liquidity: totalValueLockedUSD
      inRangeLiquidity: liquidity
      feeTier
      sqrtPrice
      token: token0 {
        id
        symbol
        name
        decimals
      }
      price: token1Price
    }
  }
`

export const ETHPrice = gql`
  query ethPrice {
    bundle(id: 1) {
      ethPrice: ethPriceUSD
    }
  }
`

export const ETHPriceSub = gql`
  subscription ethPrice {
    bundle(id: 1) {
      ethPrice: ethPriceUSD
    }
  }
`
