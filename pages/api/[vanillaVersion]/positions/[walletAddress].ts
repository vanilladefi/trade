import type { NextApiRequest, NextApiResponse } from 'next'
import { VanillaVersion } from 'types/general'
import {
  parseVanillaVersionFromQuery,
  parseWalletAddressFromQuery,
} from 'utils/api'
import { getCachedBlockNumber, getCachedEthPrice } from 'utils/cache/meta'
import {
  getCachedUserPositionsV2,
  getCachedUserPositionsV3,
} from 'utils/cache/positions'
import { getCachedV2Tokens, getCachedV3Tokens } from 'utils/cache/tokens'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  try {
    const vanillaVersion = parseVanillaVersionFromQuery(req.query)
    const address = parseWalletAddressFromQuery(req.query)

    if (address) {
      const currentBlockNumber = await getCachedBlockNumber()
      const ethPrice = await getCachedEthPrice()
      const tokens =
        vanillaVersion === VanillaVersion.V1_1
          ? await getCachedV3Tokens(currentBlockNumber, ethPrice)
          : await getCachedV2Tokens(currentBlockNumber, ethPrice)

      const positions =
        vanillaVersion === VanillaVersion.V1_1
          ? await getCachedUserPositionsV3(tokens, address)
          : await getCachedUserPositionsV2(tokens, address)

      res.status(200).json(positions)
    } else {
      res.status(404).json('No wallet found with given address')
    }
  } catch (error) {
    res.status(500).json(error)
  }
}
