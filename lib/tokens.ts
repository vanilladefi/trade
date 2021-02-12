import uniswapTokens from '@uniswap/default-token-list'
import Vibrant from 'node-vibrant'
import {
  thegraphClient,
  TokenInfoQuery,
  TokenInfoQueryHistorical,
} from 'lib/graphql'
import { ipfsToHttp } from 'lib/ipfs'
import type { Token, TokenInfoQueryResponse } from 'types/trade'

export const WETH = 'WETH'
export const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '1')
export const weth = uniswapTokens?.tokens.find(
  (token) => token.chainId === chainId && token.symbol === WETH,
)

export function getAllTokens(): Token[] {
  if (!weth) {
    throw new Error(
      `Unable to find ${WETH} in uniswap list with "chainId": ${chainId}`,
    )
  }

  // Get tokens from Uniswap default-list
  // include only tokens with specified 'chainId' and exclude WETH
  return uniswapTokens?.tokens
    .filter(
      (token) => token.chainId === chainId && token.symbol !== weth.symbol,
    )
    .map((t) => ({
      ...t,
      logoURI: ipfsToHttp(t.logoURI),
      logoColor: null,
      pairId: null,
      price: null,
      priceHistorical: null,
      liquidity: null,
      priceChange: null,
    }))
}

/**
 * Add color for each token based on its logo
 */
export function addLogoColor(tokens: Token[]): Promise<Token[]> {
  return Promise.all(
    tokens.map(async (t) => {
      let logoColor = null
      try {
        const palette = await Vibrant.from(t.logoURI).getPalette()
        logoColor = palette?.LightVibrant?.getHex() || null
      } catch (e) {}

      if (!logoColor) return t

      return {
        ...t,
        logoColor,
      }
    }),
  )
}

function calcPriceChange(newPrice: number, oldPrice: number): number {
  if (oldPrice === 0) return 0
  return (newPrice - oldPrice) / oldPrice
}

export function addData(
  tokens: Token[],
  data: TokenInfoQueryResponse[],
  historical = false,
): Token[] {
  return tokens.map((t) => {
    const d = data.find(
      (d) => t.address.toLowerCase() === d?.token.id.toLowerCase(),
    )

    if (!d) return t

    const price = !historical ? parseFloat(d.price) : t.price ?? 0
    const liquidity = !historical ? parseFloat(d.reserveUSD) : t.liquidity
    const priceHistorical = historical ? parseFloat(d.price) : t.priceHistorical
    const priceChange = priceHistorical
      ? calcPriceChange(price, priceHistorical)
      : 0

    return {
      ...t,
      pairId: d.pairId ?? t.pairId,
      price,
      priceHistorical,
      priceChange,
      liquidity,
    }
  })
}

export async function addGraphInfo(
  tokens: Token[],
  blockNumber = 0,
): Promise<Token[]> {
  if (!weth) {
    throw new Error(
      `Unable to find ${WETH} in uniswap list with "chainId": ${chainId}`,
    )
  }

  const historical = blockNumber > 0

  const query = !historical ? TokenInfoQuery : TokenInfoQueryHistorical

  const variables = {
    blockNumber,
    weth: weth.address.toLowerCase(),
    tokenAddresses: tokens.map(({ address }) => address.toLowerCase()),
  }

  try {
    // Retrieve more info from The Graph's API
    const response = await thegraphClient.request(query, variables)

    const data = [
      // Merge response arrays
      ...response?.tokensAB,
      ...response?.tokensBA,
    ]

    return addData(tokens, data, historical)
  } catch (e) {
    console.error(e)
    return tokens
  }
}
