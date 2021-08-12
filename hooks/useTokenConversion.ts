import { formatUnits, parseUnits } from '@ethersproject/units'
import { addDays } from 'date-fns'
import { BigNumber, ContractTransaction } from 'ethers'
import { isAddress } from 'lib/tokens'
import { calculateGasMargin, snapshot } from 'lib/vanilla'
import { debounce } from 'lodash'
import { useCallback, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  conversionAllowance,
  conversionDeadline,
  conversionEligibility,
  conversionStartDate,
  convertableBalance,
  merkleProof,
  tokenConversionState,
  vanillaToken1,
  vanillaToken2,
} from 'state/migration'
import { providerState, signerState } from 'state/wallet'
import { VanillaVersion } from 'types/general'
import { ConversionState } from 'types/migration'
import {
  VanillaV1Token01,
  VanillaV1Token02,
} from 'types/typechain/vanilla_v1.1'
import { VanillaV1Router02__factory } from 'types/typechain/vanilla_v1.1/factories/VanillaV1Router02__factory'
import { VanillaV1Token01__factory } from 'types/typechain/vanilla_v1.1/factories/VanillaV1Token01__factory'
import { VanillaV1Token02__factory } from 'types/typechain/vanilla_v1.1/factories/VanillaV1Token02__factory'
import {
  ethersOverrides,
  getVanillaRouterAddress,
  getVnlTokenAddress,
  vnlDecimals,
} from 'utils/config'
import useWalletAddress from './useWalletAddress'

export default function useTokenConversion(): {
  approve: () => Promise<ContractTransaction | null>
  convert: () => Promise<ContractTransaction | null>
  eligible: boolean
  conversionDeadline: Date | null
  conversionStartDate: Date | null
  proof: string[] | null
  convertableBalance: string | null
  allowance: string | null
} {
  const { long: walletAddress } = useWalletAddress()
  const signer = useRecoilValue(signerState)
  const provider = useRecoilValue(providerState)

  const [conversionState, setConversionState] =
    useRecoilState(tokenConversionState)

  const [vnlToken1, setVnlToken1] = useRecoilState(vanillaToken1)
  const [vnlToken2, setVnlToken2] = useRecoilState(vanillaToken2)

  const [convertable, setConvertable] = useRecoilState(convertableBalance)
  const [currentStartDate, setStartDate] = useRecoilState(conversionStartDate)
  const [currentDeadline, setDeadline] = useRecoilState(conversionDeadline)
  const [eligible, setEligible] = useRecoilState(conversionEligibility)
  const [proof, setProof] = useRecoilState(merkleProof)
  const [allowance, setAllowance] = useRecoilState(conversionAllowance)

  const approve = useCallback(async () => {
    const balance = parseUnits(convertable || '0', vnlDecimals)
    let approval: ContractTransaction | null = null

    if (!balance.isZero() && vnlToken2 && vnlToken1) {
      const address = isAddress(
        (await vnlToken2?.resolvedAddress) ||
          getVnlTokenAddress(VanillaVersion.V1_1) ||
          '',
      )
      if (address && signer && provider) {
        try {
          let gasEstimate = BigNumber.from(0)
          const gasPrice = await provider.getGasPrice()
          try {
            gasEstimate = await vnlToken1.estimateGas
              .approve(address, balance, { gasPrice })
              .then(calculateGasMargin)
          } catch (_) {
            gasEstimate = BigNumber.from(ethersOverrides.gasLimit)
          }

          approval = await vnlToken1.approve(address, balance, {
            gasPrice: gasPrice,
            gasLimit: gasEstimate,
          })
          setAllowance(formatUnits(balance, vnlDecimals))
        } catch (e) {
          console.error('Approve VNL1', e)
        }
      }
    }

    return approval
  }, [convertable, provider, setAllowance, signer, vnlToken1, vnlToken2])

  const convert = useCallback(async () => {
    let conversionReceipt: ContractTransaction | null = null
    if (vnlToken1 && vnlToken2 && allowance && signer && provider) {
      try {
        const parsedAllowance = parseUnits(allowance, vnlDecimals)
        if (!parsedAllowance.isZero()) {
          const { getProof } = await snapshot(vnlToken1, vnlToken2)
          const proof = getProof({
            amount: parsedAllowance,
            address: walletAddress,
          })

          let gasEstimate = BigNumber.from(0)
          const gasPrice = await provider.getGasPrice()
          try {
            gasEstimate = await vnlToken2.estimateGas
              .convertVNL(proof, {
                gasPrice,
              })
              .then(calculateGasMargin)
          } catch (_) {
            gasEstimate = BigNumber.from(ethersOverrides.gasLimit)
          }

          conversionReceipt = await vnlToken2.convertVNL(proof, {
            gasPrice: gasPrice,
            gasLimit: gasEstimate,
          })
          setAllowance(null)
        }
      } catch (e) {
        console.error('Convert VNL', e)
      }
    }
    return conversionReceipt
  }, [
    allowance,
    provider,
    setAllowance,
    signer,
    vnlToken1,
    vnlToken2,
    walletAddress,
  ])

  useEffect(() => {
    const getState = debounce(async () => {
      let nextConversionState: ConversionState | null = null
      try {
        if (signer && conversionState === ConversionState.LOADING) {
          const checkSummedAddress = isAddress(
            (await signer?.getAddress()) || '',
          )

          // If signer is connected, try fetching migration state
          if (checkSummedAddress) {
            const vnlRouter = VanillaV1Router02__factory.connect(
              getVanillaRouterAddress(VanillaVersion.V1_1),
              signer,
            )
            const legacyAddr = isAddress(
              getVnlTokenAddress(VanillaVersion.V1_0) || '',
            )
            const targetAddr = isAddress(await vnlRouter.vnlContract())

            // Connect to token contracts
            let VNLToken1: VanillaV1Token01 | undefined
            let VNLToken2: VanillaV1Token02 | undefined
            if (legacyAddr && targetAddr) {
              VNLToken1 = VanillaV1Token01__factory.connect(legacyAddr, signer)
              VNLToken2 = VanillaV1Token02__factory.connect(targetAddr, signer)
              setVnlToken1(VNLToken1)
              setVnlToken2(VNLToken2)
            } else {
              nextConversionState = ConversionState.ERROR
            }

            const legacyBalance = await VNLToken1?.balanceOf(checkSummedAddress)

            // If both tokens are connected correctly and user has legacy balance, continue
            if (VNLToken1 && VNLToken2 && !legacyBalance?.isZero()) {
              const { getProof, verify, root, snapshotState } = await snapshot(
                VNLToken1,
                VNLToken2,
              )

              // Get v1.0 token state snapshot
              const mySnapshotState = snapshotState.accounts[walletAddress]
              const myConvertableBalance =
                mySnapshotState && formatUnits(mySnapshotState, vnlDecimals)
              if (mySnapshotState.isZero()) {
                nextConversionState = ConversionState.HIDDEN
              } else {
                nextConversionState = ConversionState.AVAILABLE
                setConvertable(myConvertableBalance)
              }

              // Get start date for conversion
              const startDate = snapshotState
                ? new Date(snapshotState.timeStamp * 1000)
                : null
              setStartDate(startDate)
              if (startDate === new Date(0) || mySnapshotState.isZero()) {
                nextConversionState = ConversionState.ERROR
              }

              // Calculate conversion deadline
              const deadline = startDate ? addDays(startDate, 30) : null
              setDeadline(deadline)

              // Verify proof to check eligibility
              if (
                verify(
                  { amount: mySnapshotState, address: checkSummedAddress },
                  root,
                ) &&
                startDate !== new Date(0) &&
                !mySnapshotState.isZero()
              ) {
                const proof = getProof({
                  amount: mySnapshotState,
                  address: checkSummedAddress,
                })
                setProof(proof)
                const eligible = await VNLToken2.checkEligibility(proof)
                setEligible(eligible.convertible)
                nextConversionState = ConversionState.AVAILABLE
              }

              // Check allowance, skip straight to minting if allowance > 0
              const allowanceResponse = await VNLToken1.allowance(
                checkSummedAddress,
                VNLToken2.address,
              )
              setAllowance(formatUnits(allowanceResponse, vnlDecimals))
              if (!allowanceResponse.isZero()) {
                nextConversionState = ConversionState.APPROVED
              }
            }
          }
        }
      } catch (e) {
        nextConversionState = ConversionState.ERROR
        console.error('connect Tokens', e)
      }

      // Set the state
      nextConversionState && setConversionState(nextConversionState)
    }, 2000)

    getState()
  }, [
    conversionState,
    setAllowance,
    setConversionState,
    setConvertable,
    setDeadline,
    setEligible,
    setProof,
    setStartDate,
    setVnlToken1,
    setVnlToken2,
    signer,
    walletAddress,
  ])

  return {
    approve,
    convert,
    eligible,
    conversionDeadline: currentDeadline,
    proof,
    conversionStartDate: currentStartDate,
    convertableBalance: convertable,
    allowance,
  }
}
