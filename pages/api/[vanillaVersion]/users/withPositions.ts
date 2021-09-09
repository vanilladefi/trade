import { getUserPositions } from 'lib/vanilla'
import { getUsers } from 'lib/vanilla/users'
import type { NextApiRequest, NextApiResponse } from 'next'
import { parseVanillaVersionFromRequest } from 'utils/api'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  try {
    const usersWithPositions = {}
    const users = await getUsers()
    const vanillaVersion = parseVanillaVersionFromRequest(req)
    users.forEach(async (user) => {
      const positions = await getUserPositions(vanillaVersion, user)
      if (positions.length > 0) {
        usersWithPositions[user] = positions
      }
    })
    res.status(200).json(usersWithPositions)
  } catch (error) {
    res.status(500).json(error)
  }
}
