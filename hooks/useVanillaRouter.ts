import { Contract } from 'ethers'
import { useRecoilValue } from 'recoil'
import { providerState, signerState } from 'state/wallet'
import VanillaRouter from 'types/abis/vanillaRouter.json'
import { vanillaRouterAddress } from 'utils/config'

function useVanillaRouter(): Contract | null {
  const signer = useRecoilValue(signerState)
  const provider = useRecoilValue(providerState)
  return signer
    ? new Contract(vanillaRouterAddress, VanillaRouter.abi, signer)
    : provider
    ? new Contract(vanillaRouterAddress, VanillaRouter.abi, provider)
    : null
}

export default useVanillaRouter
