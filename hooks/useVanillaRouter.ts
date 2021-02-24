import { Contract } from 'ethers'
import { useRecoilValue } from 'recoil'
import { providerState } from 'state/wallet'
import VanillaRouterABI from 'types/abis/vanillaRouter'
import { vanillaRouterAddress } from 'utils/config'

function useVanillaRouter(): Contract | null {
  const provider = useRecoilValue(providerState)
  return provider
    ? new Contract(vanillaRouterAddress, VanillaRouterABI, provider)
    : null
}

export default useVanillaRouter
