import { Contract } from 'ethers'
import { isAddress } from 'lib/tokens'
import { useRecoilValue } from 'recoil'
import { providerState, signerState } from 'state/wallet'
import VanillaV1Router01 from 'types/abis/VanillaV1Router01.json'
import VanillaV1Router02 from 'types/abis/VanillaV1Router02.json'
import { VanillaVersion } from 'types/general'
import { getVanillaRouterAddress } from 'utils/config'

function useVanillaRouter(version: VanillaVersion): Contract | null {
  const signer = useRecoilValue(signerState)
  const provider = useRecoilValue(providerState)
  const routerAddress = isAddress(getVanillaRouterAddress(version))
  const abi =
    version === VanillaVersion.V1_0
      ? VanillaV1Router01.abi
      : VanillaV1Router02.abi

  return routerAddress
    ? signer
      ? new Contract(routerAddress, abi, signer)
      : provider
      ? new Contract(routerAddress, abi, provider)
      : null
    : null
}

export default useVanillaRouter
