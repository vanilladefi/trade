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
  VanillaV1Router02__factory,
  VanillaV1Token01,
  VanillaV1Token01__factory,
  VanillaV1Token02,
  VanillaV1Token02__factory,
} from 'types/typechain/vanilla_v1.1'
import { getVanillaRouterAddress, getVnlTokenAddress } from 'utils/config'
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

    if (!balance.isZero() && vnlToken2 && vnlToken1) {
      const address = isAddress(
        (await vnlToken2?.resolvedAddress) ||
          getVnlTokenAddress(VanillaVersion.V1_1) ||
          '',
      )
      console.log(address)
      if (address) {
        approval = await vnlToken1.approve(address, balance)
      }
    }

    return approval
  }, [convertableBalance, vnlToken1, vnlToken2])

  const getAllowance = useCallback(async () => {
    let allowance: BigNumber = BigNumber.from('0')
    const vnl1_1Addr = isAddress(
      (await vnlToken2?.resolvedAddress) ||
        getVnlTokenAddress(VanillaVersion.V1_1) ||
        '',
    )
    if (vnlToken1 && isAddress(walletAddress) && vnl1_1Addr) {
      allowance = await vnlToken1.allowance(walletAddress, vnl1_1Addr)
    }
    return allowance
  }, [vnlToken1, vnlToken2?.resolvedAddress, walletAddress])

  const convert = useCallback(async () => {
    let conversionReceipt: ContractTransaction | null = null
    if (vnlToken1 && vnlToken2) {
      const { getProof } = await snapshot(vnlToken1)
      const allowance = await getAllowance()
      const proof = getProof({
        amount: allowance,
        address: walletAddress,
      })
      conversionReceipt = await vnlToken2.convertVNL(proof)
    }
    return conversionReceipt
  }, [getAllowance, vnlToken1, vnlToken2, walletAddress])

  useEffect(() => {
    const connectTokens = async () => {
      if (signer) {
        const vnlRouter = VanillaV1Router02__factory.connect(
          getVanillaRouterAddress(VanillaVersion.V1_1),
          signer,
        )
        const legacyAddr = isAddress(
          getVnlTokenAddress(VanillaVersion.V1_0) || '',
        )
        const targetAddr = isAddress(await vnlRouter.vnlContract())
        if (legacyAddr && targetAddr) {
          const VNLToken1: VanillaV1Token01 = VanillaV1Token01__factory.connect(
            legacyAddr,
            signer,
          )
          setVnlToken1(VNLToken1)
          const VNLToken2: VanillaV1Token02 = VanillaV1Token02__factory.connect(
            targetAddr,
            signer,
          )
          setVnlToken2(VNLToken2)
        }
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
            const eligible = await vnlToken2.checkEligibility(proof)
            setEligible(eligible.convertible)
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
