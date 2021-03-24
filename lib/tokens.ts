import uniswapTokens from '@uniswap/default-token-list'
import additionalTokens from 'data/tokens.json'
import { BigNumber, constants, Contract, providers, Signer } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { ETHPriceResponse } from 'hooks/useETHPrice'
import {
  ETHPrice,
  thegraphClient,
  TokenInfoQuery,
  TokenInfoQueryHistorical,
} from 'lib/graphql'
import { ipfsToHttp } from 'lib/ipfs'
import Vibrant from 'node-vibrant'
import VanillaRouter from 'types/abis/vanillaRouter.json'
import { Eligibility, Token, TokenInfoQueryResponse } from 'types/trade'
import { chainId, defaultProvider, vanillaRouterAddress } from 'utils/config'

export { chainId }

// This is just for compatibility of local testnet with "use-wallet"
export const tokenListChainId = chainId === 1337 ? 1 : chainId

// WETH stuff
const defaultWeth = {
  chainId: 1,
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  decimals: 18,
  symbol: 'WETH',
  name: 'Wrapped Ether',
  logoURI: ipfsToHttp(
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  ),
  logoColor: null,
  pairId: null,
  price: null,
  priceHistorical: null,
  liquidity: null,
  priceChange: null,
}
export const weth: Token =
  getAllTokens()?.find(
    (token) =>
      token.chainId === tokenListChainId && token.symbol === defaultWeth.symbol,
  ) || defaultWeth

export function getAllTokens(): Token[] {
  // Get tokens from Uniswap default-list
  // include only tokens with specified 'chainId' and exclude WETH
  return [...uniswapTokens?.tokens, ...additionalTokens]
    .filter(
      (token) =>
        token.chainId === tokenListChainId &&
        token.symbol !== defaultWeth.symbol,
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

export function getLogoUri(address: string): string | undefined {
  return getAllTokens().find(
    (t) => t.address.toLowerCase() === address.toLowerCase(),
  )?.logoURI
}

/**
 * Add color for each token based on its logo
 */
export function addLogoColor(tokens: Token[]): Promise<Token[]> {
  return Promise.all(
    tokens.map(async (t) => {
      if (t.logoURI) {
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
      } else {
        return t
      }
    }),
  )
}

/**
 * Calculate USD price of each token based on ETH price
 */
export function addUSDPrice(
  tokens: Token[],
  ethPrice: number | null,
): Promise<Token[]> {
  return Promise.all(
    tokens.map(async (t) => {
      if (ethPrice && ethPrice > 0 && t.price) {
        t.priceUSD = t.price * ethPrice
      }
      return t
    }),
  )
}

/**
 * Add profit mining eligibility from Vanilla
 */
export async function addVnlEligibility(tokens: Token[]): Promise<Token[]> {
  const router = defaultProvider
    ? new Contract(vanillaRouterAddress, VanillaRouter.abi, defaultProvider)
    : null
  return Promise.all(
    tokens.map(async (t) => {
      if (router && router.isTokenRewarded) {
        const eligibility = await router.isTokenRewarded(t.address)
        t.eligible = eligibility
          ? Eligibility.Eligible
          : Eligibility.NotEligible
      }
      return t
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
  ethPrice?: number,
): Token[] {
  return tokens.map((t) => {
    const d = data.find(
      (d) => t.address.toLowerCase() === d?.token.id.toLowerCase(),
    )

    // Don't update data if pair not found
    if (!d) return t

    const price = !historical ? parseFloat(d.price) : t.price ?? 0
    const priceUSD =
      ethPrice && !historical
        ? parseFloat(d.price) * ethPrice
        : (t.price && ethPrice && t.price * ethPrice) ?? 0
    const liquidity = !historical ? parseFloat(d.reserveUSD) : t.liquidity
    const priceHistorical = historical ? parseFloat(d.price) : t.priceHistorical
    const priceChange = priceHistorical
      ? calcPriceChange(price, priceHistorical)
      : 0

    return {
      ...t,
      pairId: d.pairId ?? t.pairId,
      price,
      priceUSD,
      priceHistorical,
      priceChange,
      liquidity,
    }
  })
}

export async function addGraphInfo(
  tokens: Token[],
  blockNumber = 0,
  ethPrice?: number,
): Promise<Token[]> {
  if (!weth) {
    throw new Error(
      `Unable to find ${weth} in uniswap list with "chainId": ${chainId}`,
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

    return addData(tokens, data, historical, ethPrice)
  } catch (e) {
    console.error(e)
    return tokens
  }
}

export async function getBalance(
  address: string,
  provider: providers.JsonRpcProvider,
): Promise<BigNumber> {
  const balance = await provider.getBalance(address)
  return balance
}

export async function getETHPrice(): Promise<number | null> {
  const { data }: ETHPriceResponse = await thegraphClient.request(ETHPrice)
  return parseFloat(data?.bundle?.ethPrice) ?? null
}

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: string): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

// account is optional
export function getContract(
  address: string,
  ABI: any,
  signerOrProvider?: providers.JsonRpcProvider | Signer | undefined,
): Contract {
  if (!isAddress(address) || address === constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, signerOrProvider)
}
