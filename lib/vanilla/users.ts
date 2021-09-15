import { formatUnits } from '@ethersproject/units'
import { ADDRESS_ZERO } from '@uniswap/v3-sdk'
import { ethers } from 'ethers'
import { getBalance, isAddress } from 'lib/tokens'
import {
  getVanillaRouter,
  getVanillaTokenContract,
} from 'lib/vanilla/contracts'
import { PrerenderProps } from 'types/content'
import { VanillaVersion } from 'types/general'
import { ERC20 } from 'types/typechain/vanilla_v1.1/ERC20'
import { ERC20__factory } from 'types/typechain/vanilla_v1.1/factories/ERC20__factory'
import {
  defaultProvider,
  epoch,
  getVnlTokenAddress,
  vnlDecimals,
} from 'utils/config'

export const getUsers = async (): Promise<string[]> => {
  const users: string[] = []

  const vnlRouter = getVanillaRouter(VanillaVersion.V1_1, defaultProvider)
  const vnlLegacyRouter = getVanillaRouter(VanillaVersion.V1_0, defaultProvider)

  // Fetch Vanilla v1.1 users
  const purchaseFilter: ethers.EventFilter = vnlRouter.filters.TokensPurchased()
  const events: ethers.Event[] = await vnlRouter.queryFilter(
    purchaseFilter,
    epoch,
  )
  events.forEach(async (event, index) => {
    const block = await event.getBlock()
    console.log(index, block.number)
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
    epoch,
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
  vanillaVersion: VanillaVersion,
  walletAddress: string,
): Promise<PrerenderProps> => {
  let [vnlBalance, ethBalance]: string[] = ['0', '0']
  try {
    if (isAddress(walletAddress)) {
      const vnl: ERC20 = getVanillaTokenContract(
        vanillaVersion,
        defaultProvider,
      )
      vnlBalance = formatUnits(await vnl.balanceOf(walletAddress), vnlDecimals)
      ethBalance = formatUnits(await getBalance(walletAddress, defaultProvider))
    }
  } catch (e) {
    console.error(
      `getBasicWalletDetails failed for address ${walletAddress}: ${e}`,
    )
    throw e
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
