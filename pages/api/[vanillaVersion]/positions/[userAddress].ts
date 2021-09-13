import { getUserPositions } from 'lib/vanilla'
import type { NextApiRequest, NextApiResponse } from 'next'
import { parseVanillaVersionFromQuery } from 'utils/api'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const { walletAddress } = req.query
  const vanillaVersion = parseVanillaVersionFromQuery(req.query)
  const address =
    typeof walletAddress === 'string' ? walletAddress : walletAddress[0]
  try {
    const positions = await getUserPositions(vanillaVersion, address)
    res.status(200).json(positions)
  } catch (error) {
    res.status(500).json(error)
  }
}
