import { getUsers } from 'lib/vanilla/users'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async (
  _req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const users = await getUsers()
  res.status(200).json(users)
}
