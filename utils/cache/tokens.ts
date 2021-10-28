import { getAverageBlockCountPerHour } from 'lib/block'
import {
  addGraphInfo,
  addLogoColor,
  addObservationCardinality,
  addUSDPrice,
  addVnlEligibility,
  getAllTokens,
} from 'lib/tokens'
import { UniswapVersion, VanillaVersion } from 'types/general'
import { Eligibility, Token } from 'types/trade'
import { addToCache, getFromCache } from 'utils/cache'

export const getCachedV2Tokens = async (
  currentBlockNumber: number,
  ethPrice: number,
): Promise<Token[]> => {
  let tokensV2: Token[]
  const tokensV2CacheKey = 'tokensV2'
  const cachedTokensV2 = await getFromCache(tokensV2CacheKey)
  if (cachedTokensV2) {
    tokensV2 = JSON.parse(cachedTokensV2)
  } else {
    tokensV2 = getAllTokens(VanillaVersion.V1_0)
    tokensV2 = await addLogoColor(tokensV2)

    // Fetch these simultaneously
    const blocksPerHourV2 = await getAverageBlockCountPerHour()

    if (ethPrice === 0 || currentBlockNumber === 0 || blocksPerHourV2 === 0) {
      throw Error('Query failed')
    }

    const block24hAgo = currentBlockNumber - 24 * blocksPerHourV2

    tokensV2 = await addGraphInfo(UniswapVersion.v2, tokensV2, 0, ethPrice)
    tokensV2 = addUSDPrice(tokensV2, ethPrice)
    tokensV2 = await addVnlEligibility(tokensV2, VanillaVersion.V1_0)

    // Add historical data (price change)
    if (block24hAgo > 0) {
      tokensV2 = await addGraphInfo(
        UniswapVersion.v2,
        tokensV2,
        block24hAgo,
        ethPrice,
      )
    }

    await addToCache(tokensV2CacheKey, JSON.stringify(tokensV2))
  }
  return tokensV2
}

export const getCachedV3Tokens = async (
  currentBlockNumber: number,
  ethPrice: number,
): Promise<Token[]> => {
  let tokensV3: Token[]
  const tokensV3CacheKey = 'tokensV3'
  const cachedTokensV3 = await getFromCache(tokensV3CacheKey)
  if (cachedTokensV3) {
    tokensV3 = JSON.parse(cachedTokensV3)
  } else {
    tokensV3 = getAllTokens(VanillaVersion.V1_1)
    tokensV3 = await addLogoColor(tokensV3)

    // Fetch these simultaneously
    const blocksPerHourV3 = await getAverageBlockCountPerHour()

    if (ethPrice === 0 || currentBlockNumber === 0 || blocksPerHourV3 === 0) {
      throw Error('Query failed')
    }

    tokensV3 = await addGraphInfo(UniswapVersion.v3, tokensV3, 0, ethPrice)
    tokensV3 = addUSDPrice(tokensV3, ethPrice)
    tokensV3 = tokensV3.map((token) => {
      token.eligible = Eligibility.Eligible
      return token
    })
    tokensV3 = await addObservationCardinality(tokensV3)

    const block24hAgo = currentBlockNumber - 24 * blocksPerHourV3

    // Add historical data (price change)
    if (block24hAgo > 0) {
      tokensV3 = await addGraphInfo(
        UniswapVersion.v3,
        tokensV3,
        block24hAgo,
        ethPrice,
      )
    }

    await addToCache(tokensV3CacheKey, JSON.stringify(tokensV3))
  }
  return tokensV3
}
