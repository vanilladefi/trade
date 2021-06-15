import { formatUnits, parseUnits } from '@ethersproject/units'
import { addDays } from 'date-fns'
import { BigNumber, ContractTransaction } from 'ethers'
import { isAddress } from 'lib/tokens'
import { snapshot } from 'lib/vanilla'
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
  convert: () => Promise<ContractTransaction | null>
  getAllowance: () => Promise<BigNumber>
  eligible: boolean
  conversionDeadline: Date | null
  conversionStartDate: Date | null
  proof: string[] | undefined
  convertableBalance: string | null
} {
  const { long: walletAddress } = useWalletAddress()
  const signer = useRecoilValue(signerState)
  const { balance: VnlToken1Balance } = useVanillaGovernanceToken(
    VanillaVersion.V1_0,
  )

  const [vnlToken1, setVnlToken1] = useState<VanillaV1Token01 | null>(null)
  const [vnlToken2, setVnlToken2] = useState<VanillaV1Token02 | null>(null)

  const [convertableBalance, setConvertableBalance] = useState<string | null>(
    null,
  )
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

  const getAllowance = useCallback(async () => {
    let allowance: BigNumber = BigNumber.from('0')
    if (vnlToken2) {
      allowance = await vnlToken2.allowance(
        walletAddress,
        getVnlTokenAddress(VanillaVersion.V1_1),
      )
    }
    return allowance
  }, [vnlToken2, walletAddress])

  const convert = useCallback(async () => {
    let conversionReceipt: ContractTransaction | null = null
    if (vnlToken2 && proof) {
      conversionReceipt = await vnlToken2.convertVNL(proof)
    }
    return conversionReceipt
  }, [proof, vnlToken2])

  useEffect(() => {
    const vnl1_0Addr = getVnlTokenAddress(VanillaVersion.V1_0)
    const vnl1_1Addr = getVnlTokenAddress(VanillaVersion.V1_1)

    if (signer) {
      const VNLToken1: VanillaV1Token01 = VanillaV1Token01__factory.connect(
        vnl1_0Addr,
        signer,
      )
      setVnlToken1(VNLToken1)
      const VNLToken2: VanillaV1Token02 = VanillaV1Token02__factory.connect(
        vnl1_1Addr,
        signer,
      )
      setVnlToken2(VNLToken2)
    }
  }, [signer])

  useEffect(() => {
    const getSnapShot = async () => {
      if (vnlToken1 && vnlToken2 && signer) {
        try {
          const checkSummedAddress = isAddress(walletAddress)

          vnlToken1.connect(signer)
          const { getProof, verify, root, snapshotState } = await snapshot(
            vnlToken1,
          )

          const mySnapshotState = snapshotState.accounts[walletAddress]
          const myConvertableBalance =
            mySnapshotState && formatUnits(mySnapshotState, 12)
          setConvertableBalance(myConvertableBalance)

          const startDate = snapshotState
            ? new Date(snapshotState.timeStamp * 1000)
            : null
          setConversionStartDate(startDate)

          const deadline = startDate ? addDays(startDate, 30) : null
          setConversionDeadline(deadline)

          if (
            checkSummedAddress &&
            !mySnapshotState.isZero() &&
            verify(
              { amount: mySnapshotState, address: checkSummedAddress },
              root,
            )
          ) {
            const proof = getProof({
              amount: mySnapshotState,
              address: checkSummedAddress,
            })
            setProof(proof)
            const eligible = await vnlToken2.checkEligibility(proof)
            setEligible(eligible.convertible)
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
    getSnapShot()
  }, [VnlToken1Balance, signer, vnlToken1, vnlToken2, walletAddress])

  return {
    approve,
    convert,
    getAllowance,
    eligible,
    conversionDeadline,
    proof,
    conversionStartDate,
    convertableBalance,
  }
}
