import {
  getAllTokens,
  UniswapVersion,
  VanillaVersion,
  weth,
} from '@vanilladefi/sdk'
import { BigNumber, constants, Contract, providers, Signer } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { ETHPriceQueryResponse } from 'hooks/useETHPrice'
import { getTheGraphClient, v2, v3 } from 'lib/graphql'
import Vibrant from 'node-vibrant'
import VanillaRouter from 'types/abis/vanillaRouter.json'
import { TokenQueryVariables } from 'types/general'
import { Eligibility, Token, TokenInfoQueryResponse } from 'types/trade'
import { UniswapV3Pool__factory } from 'types/typechain/uniswap_v3_core'
import { chainId, defaultProvider } from 'utils/config'
import { getVanillaRouterAddress } from 'utils/config/vanilla'

export const getTokenInfoQueryVariables = (
  version: VanillaVersion,
  blockNumber?: number,
): TokenQueryVariables => {
  const allTokens = getAllTokens(version)

  const poolAddresses: string[] = allTokens
    .filter((token) => token && token.pool)
    .flatMap((token) => token.pool || '')

  let variables: TokenQueryVariables = {
    weth: weth.address.toLowerCase(),
    tokenAddresses: allTokens.map(({ address }) => address.toLowerCase()),
  }

  if (blockNumber !== undefined) {
    variables = {
      blockNumber: blockNumber,
      ...variables,
    }
  }

  if (version === VanillaVersion.V1_1 && poolAddresses.length > 0) {
    variables = {
      poolAddresses: poolAddresses,
      ...variables,
    }
  }
  return variables
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
        if (router?.isTokenRewarded) {
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

/**
 * Add oracle observation cardinality (Only Uniswap v3+)
 */
export async function addObservationCardinality(
  tokens: Token[],
): Promise<Token[]> {
  return Promise.all(
    tokens.map(async (t) => {
      try {
        const pool = UniswapV3Pool__factory.connect(t.pool, defaultProvider)
        const slot0 = await pool.slot0()
        slot0.observationCardinality
        if (slot0?.observationCardinality) {
          t.observationCardinality = slot0.observationCardinality
        }
      } catch (e) {
        t.observationCardinality = 0
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
        ? parseFloat(d.liquidity || '0')
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

  const variables = historical
    ? getTokenInfoQueryVariables(
        version === UniswapVersion.v2
          ? VanillaVersion.V1_0
          : VanillaVersion.V1_1,
        blockNumber,
      )
    : getTokenInfoQueryVariables(
        version === UniswapVersion.v2
          ? VanillaVersion.V1_0
          : VanillaVersion.V1_1,
      )

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
