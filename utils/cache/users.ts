import { getUsers, getVnlHolders } from 'lib/vanilla/users'
import { addToCache, getFromCache } from 'utils/cache'
import { getCachedBlockNumber, getCachedEthPrice } from 'utils/cache/meta'
import {
  getCachedUserPositionsV2,
  getCachedUserPositionsV3,
} from 'utils/cache/positions'
import { getCachedV2Tokens, getCachedV3Tokens } from 'utils/cache/tokens'

export const getCachedVnlHolders = async (): Promise<string[]> => {
  let vnlHolders: string[]
  const vnlHoldersCacheKey = 'vnlHolders'
  const cachedVnlHolders = await getFromCache(vnlHoldersCacheKey)
  if (cachedVnlHolders) {
    vnlHolders = JSON.parse(cachedVnlHolders)
  } else {
    vnlHolders = await getVnlHolders()
    await addToCache(vnlHoldersCacheKey, JSON.stringify(vnlHolders), 3600)
  }
  return vnlHolders
}

export const getCachedUsers = async (): Promise<string[]> => {
  let users: string[]
  const usersCacheKey = 'users'
  const cachedUsers = await getFromCache(usersCacheKey)
  if (cachedUsers) {
    users = JSON.parse(cachedUsers)
  } else {
    users = await getUsers()
    await addToCache(usersCacheKey, JSON.stringify(users), 3600)
  }
  return users
}

export const getCachedUsersWithPositions = async (): Promise<string[]> => {
  let users: string[]
  const usersCacheKey = 'usersWithPositions'
  const cachedUsers = await getFromCache(usersCacheKey)
  if (cachedUsers) {
    users = JSON.parse(cachedUsers)
  } else {
    const latestUsers = await getCachedUsers()

    const blockNumber = await getCachedBlockNumber()
    const ethPrice = await getCachedEthPrice()

    const tokensV2 = await getCachedV2Tokens(blockNumber, ethPrice)
    const tokensV3 = await getCachedV3Tokens(blockNumber, ethPrice)

    users = latestUsers.filter(async (user) => {
      const positionsV1_0 = await getCachedUserPositionsV2(tokensV2, user)
      const positionsV1_1 = await getCachedUserPositionsV3(tokensV3, user)
      return positionsV1_0.length + positionsV1_1.length > 0
    })

    await addToCache(usersCacheKey, JSON.stringify(users), 3600)
  }
  return users
}
