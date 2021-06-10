import { parseUnits } from '@ethersproject/units'
import { isAddress } from 'lib/tokens'
import { snapshot } from 'lib/vanilla'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { signerState } from 'state/wallet'
import { VanillaVersion } from 'types/general'
import {
  VanillaV1Token01,
  VanillaV1Token01__factory,
  VanillaV1Token02,
  VanillaV1Token02__factory,
} from 'types/typechain/vanilla_v1.1'
import { getVnlTokenAddress } from 'utils/config'
import useVanillaGovernanceToken from './useVanillaGovernanceToken'
import useWalletAddress from './useWalletAddress'

export default function useTokenConversion() {
  const { long: walletAddress } = useWalletAddress()
  const signer = useRecoilValue(signerState)
  const { balance: VnlToken1Balance } = useVanillaGovernanceToken(
    VanillaVersion.V1_0,
  )
  const [conversionDeadline, setConversionDeadline] = useState<Date | null>(
    null,
  )
  const [eligible, setEligible] = useState<boolean>(true)
  const [proof, setProof] = useState<string[]>()

  useEffect(() => {
    const getSnapShot = debounce(async () => {
      if (signer && isAddress(walletAddress)) {
        const checkSummedAddress = isAddress(walletAddress)
        const VNLToken1: VanillaV1Token01 = VanillaV1Token01__factory.connect(
          getVnlTokenAddress(VanillaVersion.V1_0),
          signer,
        )
        const vnl1TokenBalance = parseUnits(VnlToken1Balance, 12)
        const VNLToken2: VanillaV1Token02 = VanillaV1Token02__factory.connect(
          getVnlTokenAddress(VanillaVersion.V1_1),
          signer,
        )

        const { getProof, verify, root, snapshotState } = await snapshot(
          VNLToken1,
          signer,
        )

        const deadline = snapshotState
          ? new Date(snapshotState?.timeStamp * 1000)
          : null
        setConversionDeadline(deadline)

        if (
          checkSummedAddress &&
          verify(
            { amount: vnl1TokenBalance, address: checkSummedAddress },
            root,
          )
        ) {
          const proof = getProof({
            amount: vnl1TokenBalance,
            address: checkSummedAddress,
          })
          setProof(proof)
          const eligible = await VNLToken2.checkEligibility(proof)
          setEligible(eligible.convertible)
        }
      }
    }, 5000)
    getSnapShot()
  }, [VnlToken1Balance, signer, walletAddress])

  return { eligible, conversionDeadline, proof }
}
