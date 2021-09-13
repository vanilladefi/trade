import { Contract } from 'ethers'
import { getVanillaRouter } from 'lib/vanilla/contracts'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState, signerState } from 'state/wallet'
import { VanillaVersion } from 'types/general'
import { VanillaV1Router02 } from 'types/typechain/vanilla_v1.1'

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
