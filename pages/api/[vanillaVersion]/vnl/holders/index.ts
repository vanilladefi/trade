import type { NextApiRequest, NextApiResponse } from 'next'
import { getCachedVnlHolders } from 'utils/cache/users'

export default async (
  _req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const holders = await getCachedVnlHolders()
  res.status(200).json(holders)
}
