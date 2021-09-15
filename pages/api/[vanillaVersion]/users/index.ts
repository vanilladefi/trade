import { getUsers } from 'lib/vanilla/users'
import type { NextApiRequest, NextApiResponse } from 'next'
import { addToCache, getFromCache } from 'utils/cache'

export default async (
  _req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const cacheKey = 'users'
  const cachedUsers = await getFromCache(cacheKey)

  let users: string[]
  if (cachedUsers) {
    users = JSON.parse(cachedUsers)
  } else {
    users = await getUsers()
    await addToCache(cacheKey, JSON.stringify(users))
  }

  res.status(200).json(users)
}
