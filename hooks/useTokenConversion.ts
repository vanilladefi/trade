/* import { snapshot } from 'lib/vanilla'
import { useRecoilValue } from 'recoil'
import { signerState } from 'state/wallet'
import { VanillaV1Token01 } from 'types/abis/VanillaV1Token01'
import { VanillaVersion } from 'types/general'
import { getVnlTokenAddress } from 'utils/config'

export default async function useTokenConversion() {
  const signer = useRecoilValue(signerState)
  const VNLToken = new VanillaV1Token01(
    getVnlTokenAddress(VanillaVersion.V1_0),
    VanillaV1Token01,
    signer,
  )
  const { getProof, verify } = await snapshot(VNLToken, signer)
}
 */

export {}
