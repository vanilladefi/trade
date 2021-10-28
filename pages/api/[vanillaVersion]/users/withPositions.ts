import type { NextApiRequest, NextApiResponse } from 'next'
import { VanillaVersion } from 'types/general'
import { parseVanillaVersionFromQuery } from 'utils/api'
import { getCachedBlockNumber, getCachedEthPrice } from 'utils/cache/meta'
import {
  getCachedUserPositionsV2,
  getCachedUserPositionsV3,
} from 'utils/cache/positions'
import { getCachedV2Tokens, getCachedV3Tokens } from 'utils/cache/tokens'
import { getCachedUsers } from 'utils/cache/users'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  try {
    const vanillaVersion = parseVanillaVersionFromQuery(req.query)

    const usersWithPositions = {}
    const users = await getCachedUsers()

    const currentBlockNumber = await getCachedBlockNumber()
    const ethPrice = await getCachedEthPrice()
    const tokens =
      vanillaVersion === VanillaVersion.V1_1
        ? await getCachedV3Tokens(currentBlockNumber, ethPrice)
        : await getCachedV2Tokens(currentBlockNumber, ethPrice)

    users.forEach(async (user) => {
      const positions =
        vanillaVersion === VanillaVersion.V1_1
          ? await getCachedUserPositionsV3(tokens, user)
          : await getCachedUserPositionsV2(tokens, user)
      if (positions.length > 0) {
        usersWithPositions[user] = positions
      }
    })

    res.status(200).json(usersWithPositions)
  } catch (error) {
    res.status(500).json(error)
  }
}
