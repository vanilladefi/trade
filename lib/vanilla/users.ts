import { ethers } from 'ethers'
import { getVanillaRouter } from 'hooks/useVanillaRouter'
import { isAddress } from 'lib/tokens'
import { VanillaVersion } from 'types/general'
import { defaultProvider } from 'utils/config'

export const getUsers = async (): Promise<string[]> => {
  const users: string[] = []

  const vnlRouter = getVanillaRouter(VanillaVersion.V1_1, defaultProvider)
  const vnlLegacyRouter = getVanillaRouter(VanillaVersion.V1_0, defaultProvider)
  const epoch = await vnlRouter.epoch()

  // Fetch Vanilla v1.1 users
  const purchaseFilter: ethers.EventFilter = vnlRouter.filters.TokensPurchased()
  const events: ethers.Event[] = await vnlRouter.queryFilter(
    purchaseFilter,
    epoch.toNumber(),
  )
  events.forEach((event) => {
    const userAddress = isAddress(event.args.buyer)
    if (userAddress && !users.includes(userAddress)) {
      users.push(userAddress)
    }
  })

  // Fetch Vanilla v1.0 users
  const legacyFilter: ethers.EventFilter =
    vnlLegacyRouter.filters.TokensPurchased()
  const legacyEvents: ethers.Event[] = await vnlLegacyRouter.queryFilter(
    legacyFilter,
    epoch.toNumber(),
  )
  legacyEvents.forEach((event) => {
    const userAddress = isAddress(event.args.buyer)
    if (userAddress && !users.includes(userAddress)) {
      users.push(userAddress)
    }
  })

  return users
}
