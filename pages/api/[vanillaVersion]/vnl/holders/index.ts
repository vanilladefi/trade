import { getVnlHolders } from 'lib/vanilla/users'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async (
  _req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const holders = await getVnlHolders()
  res.status(200).json(holders)
}
