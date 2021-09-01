import { ethers } from 'ethers'
import { isAddress } from 'lib/tokens'
import { VanillaVersion } from 'types/general'
import { VanillaV1Router02__factory } from 'types/typechain/vanilla_v1.1/factories/VanillaV1Router02__factory'
import { VanillaV1Router02 } from 'types/typechain/vanilla_v1.1/VanillaV1Router02'
import { defaultProvider, getVanillaRouterAddress } from 'utils/config'

export const getUsers = async (): Promise<string[]> => {
  const vnlRouter: VanillaV1Router02 = VanillaV1Router02__factory.connect(
    getVanillaRouterAddress(VanillaVersion.V1_1),
    defaultProvider,
  )
  const epoch = await vnlRouter.epoch()
  const purchaseFilter: ethers.EventFilter = vnlRouter.filters.TokensPurchased()
  const events: ethers.Event[] = await vnlRouter.queryFilter(
    purchaseFilter,
    epoch.toNumber(),
  )
  const users: string[] = []
  events.forEach((event) => {
    const userAddress = isAddress(event.args.buyer)
    if (userAddress && !users.includes(userAddress)) {
      users.push(userAddress)
    }
  })
  return users
}
