import { ethers, providers } from 'ethers'
import vanillaABI from 'types/vanillaRouter'
import { vanillaRouterAddress } from 'utils/config'

export const getVnlTokenAddress = async (
  provider: providers.JsonRpcProvider,
): Promise<string> => {
  const vanillaRouter = new ethers.Contract(
    vanillaRouterAddress,
    JSON.stringify(vanillaABI),
    provider,
  )
  return vanillaRouter.vnlContract()
}
