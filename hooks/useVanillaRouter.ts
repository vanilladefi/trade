import { Contract, providers, Signer } from 'ethers'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState, signerState } from 'state/wallet'
import VanillaV1Router01 from 'types/abis/VanillaV1Router01.json'
import { VanillaVersion } from 'types/general'
import { VanillaV1Router02 } from 'types/typechain/vanilla_v1.1'
import { VanillaV1Router02__factory } from 'types/typechain/vanilla_v1.1/factories/VanillaV1Router02__factory'
import { getVanillaRouterAddress } from 'utils/config'

export function getVanillaRouter(
  version: VanillaVersion,
  signerOrProvider: Signer | providers.Provider,
): Contract | VanillaV1Router02 {
  const routerAddress = getVanillaRouterAddress(version)
  const v1abi = VanillaV1Router01.abi
  return version === VanillaVersion.V1_1
    ? VanillaV1Router02__factory.connect(routerAddress, signerOrProvider)
    : new Contract(routerAddress, v1abi, signerOrProvider)
}

function useVanillaRouter(
  version: VanillaVersion,
): VanillaV1Router02 | Contract | null {
  const signer = useRecoilValue(signerState)
  const provider = useRecoilValue(providerState)

  const [router, setRouter] = useState<Contract | null>(null)

  useEffect(() => {
    const contract =
      signer || provider ? getVanillaRouter(version, signer || provider) : null
    setRouter(contract)
  }, [provider, signer, version])

  return router
}

export default useVanillaRouter
