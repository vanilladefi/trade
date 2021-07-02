import { formatUnits, parseUnits } from '@ethersproject/units'
import { addDays } from 'date-fns'
import { BigNumber, ContractTransaction } from 'ethers'
import { isAddress } from 'lib/tokens'
import { snapshot } from 'lib/vanilla'
import { useCallback, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  conversionAllowance,
  conversionDeadline,
  conversionEligibility,
  conversionStartDate,
  convertableBalance,
  merkleProof,
  vanillaToken1,
  vanillaToken2,
} from 'state/migration'
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
  allowance: string | null
} {
  const { long: walletAddress } = useWalletAddress()
  const signer = useRecoilValue(signerState)

  const [vnlToken1, setVnlToken1] = useRecoilState(vanillaToken1)
  const [vnlToken2, setVnlToken2] = useRecoilState(vanillaToken2)

  const [convertable, setConvertable] = useRecoilState(convertableBalance)
  const [currentStartDate, setStartDate] = useRecoilState(conversionStartDate)
  const [currentDeadline, setDeadline] = useRecoilState(conversionDeadline)
  const [eligible, setEligible] = useRecoilState(conversionEligibility)
  const [proof, setProof] = useRecoilState(merkleProof)
  const [allowance, setAllowance] = useRecoilState(conversionAllowance)

  const approve = useCallback(async () => {
    const balance = parseUnits(convertable || '0', 12)
    let approval: ContractTransaction | null = null

    if (!balance.isZero() && vnlToken2 && vnlToken1) {
      const address = isAddress(
        (await vnlToken2?.resolvedAddress) ||
          getVnlTokenAddress(VanillaVersion.V1_1) ||
          '',
      )
      if (address) {
        try {
          approval = await vnlToken1.approve(address, balance)
          setAllowance(formatUnits(balance, 12))
        } catch (e) {
          console.error(e)
        }
      }
    }

    return approval
  }, [convertable, setAllowance, vnlToken1, vnlToken2])

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
    setAllowance(formatUnits(allowance, 12))
    return allowance
  }, [setAllowance, vnlToken1, vnlToken2?.resolvedAddress, walletAddress])

  const convert = useCallback(async () => {
    let conversionReceipt: ContractTransaction | null = null
    if (vnlToken1 && vnlToken2) {
      try {
        const { getProof } = await snapshot(vnlToken1)
        const latestAllowance = await getAllowance()
        const proof = getProof({
          amount: latestAllowance,
          address: walletAddress,
        })
        conversionReceipt = await vnlToken2.convertVNL(proof)
        setAllowance(null)
      } catch (e) {
        console.error(e)
      }
    }
    return conversionReceipt
  }, [getAllowance, setAllowance, vnlToken1, vnlToken2, walletAddress])

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
  }, [setVnlToken1, setVnlToken2, signer])

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
          setConvertable(myConvertableBalance)

          const startDate = snapshotState
            ? new Date(snapshotState.timeStamp * 1000)
            : null
          setStartDate(startDate)

          const deadline = startDate ? addDays(startDate, 30) : null
          setDeadline(deadline)

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
      setDeadline(null)
      setConvertable(null)
      setStartDate(null)
    }
  }, [
    setConvertable,
    setDeadline,
    setEligible,
    setProof,
    setStartDate,
    signer,
    vnlToken1,
    vnlToken2,
    walletAddress,
  ])

  return {
    approve,
    convert,
    getAllowance,
    eligible,
    conversionDeadline: currentDeadline,
    proof,
    conversionStartDate: currentStartDate,
    convertableBalance: convertable,
    allowance,
  }
}
