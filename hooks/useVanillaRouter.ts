import { Contract } from 'ethers'
import { useRecoilValue } from 'recoil'
import { providerState } from 'state/wallet'
import VanillaRouter from 'types/abis/vanillaRouter.json'
import { vanillaRouterAddress } from 'utils/config'

function useVanillaRouter(): Contract | null {
  const provider = useRecoilValue(providerState)
  return provider
    ? new Contract(vanillaRouterAddress, VanillaRouter.abi, provider)
    : null
}

export default useVanillaRouter
