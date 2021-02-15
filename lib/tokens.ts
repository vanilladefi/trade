import uniswapTokens from '@uniswap/default-token-list'
import { Token as UniswapToken } from '@uniswap/sdk'
import { Contract, providers, utils } from 'ethers'
import { thegraphClient, TokenInfoQuery } from 'lib/graphql'
import { ipfsToHttp } from 'lib/ipfs'
import Vibrant from 'node-vibrant'
import type { Token, TokenInfoQueryResponse } from 'types/trade'
import { chainId } from 'utils/config'

// This is just for compatibility of local testnet with "use-wallet"
export const tokenListChainId = chainId === 1337 ? 1 : chainId

export const WETH = 'WETH'
export const weth = uniswapTokens?.tokens.find(
  (token) => token.chainId === tokenListChainId && token.symbol === WETH,
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
      (token) =>
        token.chainId === tokenListChainId && token.symbol !== weth.symbol,
    )
    .map((t) => ({
      ...t,
      logoURI: ipfsToHttp(t.logoURI),
      logoColor: null,
      pairId: null,
      price: null,
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

export function addData(
  tokens: Token[],
  data: TokenInfoQueryResponse[],
): Token[] {
  return tokens.map((t) => {
    const d = data.find(
      (d) => t.address.toLowerCase() === d?.token.id.toLowerCase(),
    )

    if (!d) return t

    return {
      ...t,
      pairId: d.pairId,
      price: parseFloat(d.price),
      liquidity: parseFloat(d.reserveUSD),
      priceChange: 0,
    }
  })
}

export async function addGraphInfo(tokens: Token[]): Promise<Token[]> {
  if (!weth) {
    throw new Error(
      `Unable to find ${WETH} in uniswap list with "chainId": ${chainId}`,
    )
  }

  try {
    // Retrieve more info from The Graph's API
    const response = await thegraphClient.request(TokenInfoQuery, {
      weth: weth.address.toLowerCase(),
      tokenAddresses: tokens.map(({ address }) => address.toLowerCase()),
    })

    const data = [
      // Merge response arrays
      ...response?.tokensAB,
      ...response?.tokensBA,
    ]

    return addData(tokens, data)
  } catch (e) {
    return tokens
  }
}

export async function getERC20TokenBalance(
  address: string,
  token: UniswapToken,
  provider: providers.JsonRpcProvider,
): Promise<number> {
  const ERCBalanceQueryABI = [
    {
      name: 'balanceOf',
      type: 'function',
      inputs: [
        {
          name: '_owner',
          type: 'address',
        },
      ],
      outputs: [
        {
          name: 'balance',
          type: 'uint256',
        },
      ],
      constant: true,
      payable: false,
    },
  ]
  const contract = new Contract(token.address, ERCBalanceQueryABI, provider)
  const balance = await contract.balanceOf(address)
  return parseFloat(utils.formatUnits(balance, token.decimals))
}
