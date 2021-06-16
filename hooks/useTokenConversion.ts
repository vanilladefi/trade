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
import useWalletAddress from './useWalletAddress'

export default function useTokenConversion(): {
  approve: () => Promise<ContractTransaction | null>
  convert: () => Promise<ContractTransaction | null>
  getAllowance: () => Promise<BigNumber>
  eligible: boolean
  conversionDeadline: Date | null
  conversionStartDate: Date | null
  proof: string[] | null
  convertableBalance: string | null
} {
  const { long: walletAddress } = useWalletAddress()
  const signer = useRecoilValue(signerState)

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
  const [eligible, setEligible] = useState<boolean>(false)
  const [proof, setProof] = useState<string[] | null>(null)

  const approve = useCallback(async () => {
    const balance = parseUnits(convertableBalance || '0', 12)
    let approval: ContractTransaction | null = null
    if (!balance.isZero() && vnlToken2) {
      approval = await vnlToken2.approve(
        getVnlTokenAddress(VanillaVersion.V1_1),
        balance,
      )
    }
    return approval
  }, [convertableBalance, vnlToken2])

  const getAllowance = useCallback(async () => {
    let allowance: BigNumber = BigNumber.from('0')
    if (vnlToken2 && isAddress(walletAddress)) {
      allowance = await vnlToken2.allowance(walletAddress, vnlToken2.address)
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
    const connectTokens = async () => {
      const vnl1_0Addr = isAddress(
        getVnlTokenAddress(VanillaVersion.V1_0) || '',
      )
      const vnl1_1Addr = isAddress(
        getVnlTokenAddress(VanillaVersion.V1_1) || '',
      )
      if (signer && vnl1_0Addr && vnl1_1Addr) {
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
    }
    connectTokens()

    return () => {
      setVnlToken1(null)
      setVnlToken2(null)
    }
  }, [signer])

  useEffect(() => {
    const getSnapShot = async () => {
      const checkSummedAddress = isAddress((await signer?.getAddress()) || '')
      if (vnlToken1 && vnlToken2) {
        try {
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
            setEligible(true)
            //const eligible = await vnlToken2.checkEligibility(proof)
            //setEligible(eligible.convertible)
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
    getSnapShot()

    return () => {
      setEligible(false)
      setProof(null)
      setConversionDeadline(null)
      setConvertableBalance(null)
      setConversionStartDate(null)
    }
  }, [signer, vnlToken1, vnlToken2, walletAddress])

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
