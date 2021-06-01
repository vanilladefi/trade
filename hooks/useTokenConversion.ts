import { snapshot } from 'lib/vanilla'
import { useRecoilValue } from 'recoil'
import { signerState } from 'state/wallet'
import { VanillaV1Token01 } from 'types/abis/VanillaV1Token01'
import { VNLTokenAddress } from 'utils/config'

export default function useTokenConversion() {
  const signer = useRecoilValue(signerState)
  const VNLToken = new VanillaV1Token01(
    VNLTokenAddress,
    VanillaV1Token01,
    signer,
  )
  const { getProof, verify } = snapshot()
}
