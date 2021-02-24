import uniswapTokens from '@uniswap/default-token-list'
import additionalTokens from 'data/tokens.json'
import { constants, Contract, providers, Signer, utils } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import {
  thegraphClient,
  TokenInfoQuery,
  TokenInfoQueryHistorical,
} from 'lib/graphql'
import { ipfsToHttp } from 'lib/ipfs'
import Vibrant from 'node-vibrant'
import type { Token, TokenInfoQueryResponse, UniSwapToken } from 'types/trade'
import { chainId } from 'utils/config'

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
  return getAllTokens().find((t) => t.address === address)?.logoURI
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

    return addData(tokens, data, historical)
  } catch (e) {
    console.error(e)
    return tokens
  }
}

export async function getERC20TokenBalance(
  address: string,
  token: UniSwapToken,
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
  const contract = getContract(token.address, ERCBalanceQueryABI, provider)
  const balance = await contract.balanceOf(address)
  return parseFloat(utils.formatUnits(balance, token.decimals))
}

export async function getBalance(
  address: string,
  provider: providers.JsonRpcProvider,
): Promise<number> {
  const balance = await provider.getBalance(address)
  return parseFloat(utils.formatUnits(balance, 18))
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
