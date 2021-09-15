import { getUserPositions } from 'lib/vanilla'
import { VanillaVersion } from 'types/general'
import { Token } from 'types/trade'
import { addToCache, getFromCache } from '.'

export const getUserPositionsV2 = async (
  tokens: Token[],
  walletAddress: string | false,
): Promise<Token[] | null> => {
  let userPositionsV2: Token[] | null = null
  if (walletAddress) {
    const userPositionsV2CacheKey = `v1.0-positions-${walletAddress}`
    const cachedPositions = await getFromCache(userPositionsV2CacheKey)
    if (cachedPositions) {
      userPositionsV2 = JSON.parse(cachedPositions)
    } else {
      userPositionsV2 = await getUserPositions(
        VanillaVersion.V1_0,
        walletAddress,
        tokens,
      )
      await addToCache(
        userPositionsV2CacheKey,
        JSON.stringify(userPositionsV2),
        1800,
      )
    }
  }
  return userPositionsV2
}

export const getUserPositionsV3 = async (
  tokens: Token[],
  walletAddress: string | false,
): Promise<Token[] | null> => {
  let userPositionsV3: Token[] | null = null
  if (walletAddress) {
    const userPositionsV3CacheKey = `v1.1-positions-${walletAddress}`
    const cachedPositions = await getFromCache(userPositionsV3CacheKey)
    if (cachedPositions) {
      userPositionsV3 = JSON.parse(cachedPositions)
    } else {
      userPositionsV3 = await getUserPositions(
        VanillaVersion.V1_1,
        walletAddress,
        tokens,
      )
      await addToCache(
        userPositionsV3CacheKey,
        JSON.stringify(userPositionsV3),
        1800,
      )
    }
  }
  return userPositionsV3
}
