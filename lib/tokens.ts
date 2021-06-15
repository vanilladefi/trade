import uniswapTokens from '@uniswap/default-token-list'
import additionalTokens from 'data/tokens.json'
import { BigNumber, constants, Contract, providers, Signer } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { ETHPriceQueryResponse } from 'hooks/useETHPrice'
import { getTheGraphClient, UniswapVersion, v2, v3 } from 'lib/graphql'
import { ipfsToHttp } from 'lib/ipfs'
import Vibrant from 'node-vibrant'
import VanillaRouter from 'types/abis/vanillaRouter.json'
import { VanillaVersion } from 'types/general'
import { Eligibility, Token, TokenInfoQueryResponse } from 'types/trade'
import { chainId, defaultProvider, getVanillaRouterAddress } from 'utils/config'

export { chainId }

// This is just for compatibility of local testnet with "use-wallet"
export const tokenListChainId = chainId === 1337 ? 1 : chainId

// WETH stuff
const defaultWeth = {
  chainId: String(1),
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  decimals: String(18),
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
      token.chainId === String(tokenListChainId) &&
      token.symbol === defaultWeth.symbol,
  ) || defaultWeth

export function getAllTokens(): Token[] {
  // Convert TokenList format to our own format
  const defaultTokens: Token[] = uniswapTokens?.tokens
    .map((t) => JSON.parse(JSON.stringify(t))) // Needed for casting to Token[] format
    .map((t) => ({
      ...t,
      chainId: String(t.chainId),
      decimals: String(t.decimals),
    }))
  const vanillaAdditionalTokens: Token[] = additionalTokens
    .map((t) => JSON.parse(JSON.stringify(t))) // Needed for casting to Token[] format
    .map((t) => ({
      ...t,
      chainId: String(t.chainId),
      decimals: String(t.decimals),
    }))

  // include only tokens with specified 'chainId' and exclude WETH
  return [...defaultTokens, ...vanillaAdditionalTokens]
    .filter(
      (token) =>
        token.chainId === String(tokenListChainId) &&
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
export function addUSDPrice(tokens: Token[], ethPrice: number | null): Token[] {
  return tokens.map((t) => {
    if (ethPrice && ethPrice > 0 && t.price) {
      t.priceUSD = t.price * ethPrice
    }
    return t
  })
}

/**
 * Add profit mining eligibility from Vanilla
 */
export async function addVnlEligibility(
  tokens: Token[],
  version: VanillaVersion,
): Promise<Token[]> {
  const router = defaultProvider
    ? new Contract(
        getVanillaRouterAddress(version),
        VanillaRouter.abi,
        defaultProvider,
      )
    : null
  return Promise.all(
    tokens.map(async (t) => {
      try {
        if (router && router.isTokenRewarded) {
          const eligibility = await router.isTokenRewarded(t.address)
          t.eligible = eligibility
            ? Eligibility.Eligible
            : Eligibility.NotEligible
        }
      } catch (e) {
        t.eligible = Eligibility.NotEligible
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
  version: UniswapVersion,
  tokens: Token[],
  data: TokenInfoQueryResponse[],
  historical = false,
  ethPrice: number,
): Token[] {
  return tokens.map((t) => {
    const d = data.find(
      (d) => t.address.toLowerCase() === d?.token.id.toLowerCase(),
    )

    // Don't update data if pair not found
    if (!d) return t

    const price = !historical ? parseFloat(d.price) : t.price || 0
    const priceUSD =
      ethPrice && !historical
        ? parseFloat(d.price) * ethPrice
        : (t.price && ethPrice && t.price * ethPrice) || t.priceUSD || 0
    const priceHistorical = historical ? parseFloat(d.price) : t.priceHistorical
    const priceChange = priceHistorical
      ? calcPriceChange(price, priceHistorical)
      : t.priceChange || 0

    if (version === UniswapVersion.v2) {
      const liquidity = !historical
        ? parseFloat(d.reserveUSD || '0')
        : t.liquidity
      const reserveETH = d.reserveETH || t.reserveETH
      const reserveToken = d.reserveToken || t.reserveToken
      return {
        ...t,
        pairId: d.pairId ?? t.pairId,
        price,
        priceUSD,
        priceHistorical,
        priceChange,
        liquidity,
        reserveETH,
        reserveToken,
      }
    } else {
      const liquidity = !historical
        ? parseFloat(d.liquidity || '0') * ethPrice
        : t.liquidity
      return {
        ...t,
        pairId: d.pairId ?? t.pairId,
        price,
        priceUSD,
        priceHistorical,
        priceChange,
        liquidity,
        sqrtPrice: d.sqrtPrice ?? t.sqrtPrice,
        inRangeLiquidity: d.inRangeLiquidity ?? t.inRangeLiquidity,
      }
    }
  })
}

export async function addGraphInfo(
  version: UniswapVersion,
  tokens: Token[],
  blockNumber = 0,
  ethPrice: number,
): Promise<Token[]> {
  if (!weth) {
    throw new Error(
      `Unable to find ${weth} in uniswap list with "chainId": ${chainId}`,
    )
  }

  const historical = blockNumber > 0

  const query =
    version === UniswapVersion.v2
      ? !historical
        ? v2.TokenInfoQuery
        : v2.TokenInfoQueryHistorical
      : !historical
      ? v3.TokenInfoQuery
      : v3.TokenInfoQueryHistorical

  const variables = {
    blockNumber,
    weth: weth.address.toLowerCase(),
    tokenAddresses: tokens.map(({ address }) => address.toLowerCase()),
  }

  try {
    const { http } = getTheGraphClient(version)
    if (http) {
      // Retrieve more info from The Graph's API
      const response = await http.request(query, variables)

      const data = [
        // Merge response arrays
        ...response?.tokensAB,
        ...response?.tokensBA,
      ]

      return addData(version, tokens, data, historical, ethPrice)
    } else {
      return tokens
    }
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

export async function getETHPrice(version: UniswapVersion): Promise<number> {
  let parsedPrice: number
  try {
    const { http } = getTheGraphClient(version)
    const query = version === UniswapVersion.v2 ? v2.ETHPrice : v3.ETHPrice

    const response: ETHPriceQueryResponse | undefined = await http?.request(
      query,
    )

    if (response?.bundle) {
      parsedPrice = parseFloat(response.bundle.ethPrice)
      if (parsedPrice === NaN) {
        throw Error(
          'Could not parse ETH/USD price from response, falling back to ETH/USD 0!',
        )
      }
    } else {
      throw Error('TheGraph did not respond, falling back to ETH/USD 0!')
    }
  } catch (e) {
    console.error(e)
    parsedPrice = 0
  }
  return parsedPrice
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
