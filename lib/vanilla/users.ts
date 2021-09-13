import { formatUnits } from '@ethersproject/units'
import { ADDRESS_ZERO } from '@uniswap/v3-sdk'
import { ethers } from 'ethers'
import { getVanillaRouter } from 'hooks/useVanillaRouter'
import { getBalance, isAddress } from 'lib/tokens'
import { PrerenderProps } from 'types/content'
import { VanillaVersion } from 'types/general'
import { ERC20__factory } from 'types/typechain/vanilla_v1.1/factories/ERC20__factory'
import { defaultProvider, getVnlTokenAddress, vnlDecimals } from 'utils/config'

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
    const walletAddress = isAddress(event.args.buyer)
    if (walletAddress && !users.includes(walletAddress)) {
      users.push(walletAddress)
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
    const walletAddress = isAddress(event.args.buyer)
    if (walletAddress && !users.includes(walletAddress)) {
      users.push(walletAddress)
    }
  })

  return users
}

export const getBasicWalletDetails = async (
  walletAddress: string,
): Promise<PrerenderProps> => {
  let [vnlBalance, ethBalance]: string[] = ['0', '0']
  if (isAddress(walletAddress)) {
    vnlBalance = formatUnits(
      await ERC20__factory.connect(
        getVnlTokenAddress(VanillaVersion.V1_1),
        defaultProvider,
      ).balanceOf(walletAddress),
      vnlDecimals,
    )
    console.log(vnlBalance)
    ethBalance = formatUnits(await getBalance(walletAddress, defaultProvider))
    console.log(ethBalance)
  }
  return { vnlBalance, ethBalance }
}

export const getVnlHolders = async (): Promise<string[]> => {
  const vnlToken = ERC20__factory.connect(
    getVnlTokenAddress(VanillaVersion.V1_1),
    defaultProvider,
  )
  const vnlRouter = getVanillaRouter(VanillaVersion.V1_1, defaultProvider)
  const epoch = await vnlRouter.epoch()

  const transferFilter: ethers.EventFilter = vnlToken.filters.Transfer()
  const events: ethers.Event[] = await vnlToken.queryFilter(
    transferFilter,
    epoch.toNumber(),
  )

  const vnlHolders = new Set<string>()

  events.forEach((event) => {
    event.args.from !== ADDRESS_ZERO && vnlHolders.add(event.args.from)
    event.args.to !== ADDRESS_ZERO && vnlHolders.add(event.args.to)
  })

  return Array.from(vnlHolders)
}
