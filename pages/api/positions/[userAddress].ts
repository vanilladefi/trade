import { getUserPositions } from 'lib/vanilla'
import type { NextApiRequest, NextApiResponse } from 'next'
import { VanillaVersion } from 'types/general'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const { userAddress } = req.query
  const address = typeof userAddress === 'string' ? userAddress : userAddress[0]
  const positions = await getUserPositions(VanillaVersion.V1_1, address)
  res.status(200).json(positions)
}
