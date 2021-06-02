import { Contract } from 'ethers'
import { useRecoilValue } from 'recoil'
import { providerState, signerState } from 'state/wallet'
import VanillaRouter from 'types/abis/vanillaRouter.json'
import { VanillaVersion } from 'types/general'
import { getVanillaRouterAddress } from 'utils/config'

function useVanillaRouter(version: VanillaVersion): Contract | null {
  const signer = useRecoilValue(signerState)
  const provider = useRecoilValue(providerState)
  return signer
    ? new Contract(getVanillaRouterAddress(version), VanillaRouter.abi, signer)
    : provider
    ? new Contract(
        getVanillaRouterAddress(version),
        VanillaRouter.abi,
        provider,
      )
    : null
}

export default useVanillaRouter
