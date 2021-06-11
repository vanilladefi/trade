import { parseUnits } from '@ethersproject/units'
import { ContractTransaction } from 'ethers'
import { isAddress } from 'lib/tokens'
import { snapshot } from 'lib/vanilla'
import { debounce } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
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

export default function useTokenConversion(): {
  approve: () => Promise<ContractTransaction | null>
  eligible: boolean
  conversionDeadline: Date | null
  conversionStartDate: Date | null
  proof: string[] | undefined
} {
  const { long: walletAddress } = useWalletAddress()
  const signer = useRecoilValue(signerState)
  const { balance: VnlToken1Balance } = useVanillaGovernanceToken(
    VanillaVersion.V1_0,
  )

  const [vnlToken1, setVnlToken1] = useState<VanillaV1Token01 | null>(null)
  const [vnlToken2, setVnlToken2] = useState<VanillaV1Token02 | null>(null)

  const [conversionStartDate, setConversionStartDate] = useState<Date | null>(
    null,
  )
  const [conversionDeadline, setConversionDeadline] = useState<Date | null>(
    null,
  )
  const [eligible, setEligible] = useState<boolean>(true)
  const [proof, setProof] = useState<string[]>()

  const approve = useCallback(async () => {
    const balance = parseUnits(VnlToken1Balance, 12)
    let approval: ContractTransaction | null = null
    if (!balance.isZero() && vnlToken2) {
      approval = await vnlToken2.approve(
        getVnlTokenAddress(VanillaVersion.V1_1),
        balance,
      )
    }
    return approval
  }, [VnlToken1Balance, vnlToken2])

  useEffect(() => {
    if (signer) {
      const VNLToken1: VanillaV1Token01 = VanillaV1Token01__factory.connect(
        getVnlTokenAddress(VanillaVersion.V1_0),
        signer,
      )
      setVnlToken1(VNLToken1)
      const VNLToken2: VanillaV1Token02 = VanillaV1Token02__factory.connect(
        getVnlTokenAddress(VanillaVersion.V1_1),
        signer,
      )
      setVnlToken2(VNLToken2)
    }
  }, [signer])

  useEffect(() => {
    const getSnapShot = debounce(async () => {
      if (vnlToken1 && vnlToken2 && signer) {
        const checkSummedAddress = isAddress(walletAddress)
        const vnl1TokenBalance = parseUnits(VnlToken1Balance, 12)

        const { getProof, verify, root, snapshotState } = await snapshot(
          vnlToken1,
          signer,
        )

        const deadline = snapshotState
          ? new Date(snapshotState?.timeStamp * 1000)
          : null
        setConversionDeadline(deadline)

        const startDate = snapshotState
          ? new Date(snapshotState.timeStamp * 1000)
          : null
        setConversionStartDate(startDate)

        if (
          checkSummedAddress &&
          !vnl1TokenBalance.isZero() &&
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
          const eligible = await vnlToken2.checkEligibility(proof)
          setEligible(eligible.convertible)
        }
      }
    }, 200)
    getSnapShot()
  }, [VnlToken1Balance, signer, vnlToken1, vnlToken2, walletAddress])

  return { approve, eligible, conversionDeadline, proof, conversionStartDate }
}
