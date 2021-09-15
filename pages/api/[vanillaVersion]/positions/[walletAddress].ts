import { getUserPositions } from 'lib/vanilla'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Token } from 'types/trade'
import {
  parseVanillaVersionFromQuery,
  parseWalletAddressFromQuery,
} from 'utils/api'
import { addToCache, getFromCache } from 'utils/cache'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  try {
    const vanillaVersion = parseVanillaVersionFromQuery(req.query)
    const address = parseWalletAddressFromQuery(req.query)

    const cacheKey = `${vanillaVersion}-positions-${address}`
    const cachedPositions = await getFromCache(cacheKey)

    if (address) {
      let positions: Token[]

      if (cachedPositions) {
        positions = JSON.parse(cachedPositions)
      } else {
        positions = await getUserPositions(vanillaVersion, address)
        await addToCache(cacheKey, JSON.stringify(positions))
      }

      res.status(200).json(positions)
    } else {
      res.status(404).json('No wallet found with given address')
    }
  } catch (error) {
    res.status(500).json(error)
  }
}
