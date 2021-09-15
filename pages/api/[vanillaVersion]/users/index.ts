import type { NextApiRequest, NextApiResponse } from 'next'
import { getCachedUsers } from 'utils/cache/users'

export default async (
  _req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const users = await getCachedUsers()
  res.status(200).json(users)
}
