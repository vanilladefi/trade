import { getUserPositions } from 'lib/vanilla'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  parseVanillaVersionFromQuery,
  parseWalletAddressFromQuery,
} from 'utils/api'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  try {
    const vanillaVersion = parseVanillaVersionFromQuery(req.query)
    const address = parseWalletAddressFromQuery(req.query)
    if (address) {
      const positions = await getUserPositions(vanillaVersion, address)
      res.status(200).json(positions)
    } else {
      res.status(404).json('No wallet found with given address')
    }
  } catch (error) {
    res.status(500).json(error)
  }
}
