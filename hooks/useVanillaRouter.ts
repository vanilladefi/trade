import { Contract } from 'ethers'
import { isAddress } from 'lib/tokens'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState, signerState } from 'state/wallet'
import VanillaV1Router01 from 'types/abis/VanillaV1Router01.json'
import { VanillaVersion } from 'types/general'
import { VanillaV1Router02 } from 'types/typechain/vanilla_v1.1'
import { VanillaV1Router02__factory } from 'types/typechain/vanilla_v1.1/factories/VanillaV1Router02__factory'
import { getVanillaRouterAddress } from 'utils/config'

function useVanillaRouter(
  version: VanillaVersion,
): VanillaV1Router02 | Contract | null {
  const signer = useRecoilValue(signerState)
  const provider = useRecoilValue(providerState)

  const routerAddress = isAddress(getVanillaRouterAddress(version))
  const v1abi = VanillaV1Router01.abi

  const [router, setRouter] = useState<Contract | null>(null)

  useEffect(() => {
    if (routerAddress) {
      const contract = signer
        ? version === VanillaVersion.V1_1
          ? VanillaV1Router02__factory.connect(routerAddress, signer)
          : new Contract(routerAddress, v1abi, signer)
        : provider
        ? version === VanillaVersion.V1_1
          ? VanillaV1Router02__factory.connect(routerAddress, provider)
          : new Contract(routerAddress, v1abi, provider)
        : null
      setRouter(contract)
    }
  }, [provider, routerAddress, signer, v1abi, version])

  return router
}

export default useVanillaRouter
