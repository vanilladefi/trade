import useAllTransactions from 'hooks/useAllTransactions'
import useTokenConversion from 'hooks/useTokenConversion'
import useWalletAddress from 'hooks/useWalletAddress'
import { isAddress } from 'lib/tokens'
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { tokenConversionState } from 'state/migration'
import { VanillaVersion } from 'types/general'
import { ConversionState } from 'types/migration'
import { Action, TransactionDetails } from 'types/trade'
import { getVnlTokenAddress } from 'utils/config'
import Wrapper from '../Wrapper'
import { Approved, Approving, Available, Minted, Ready } from './Views'

export type ConversionViewProps = {
  approve?: () => Promise<boolean>
  convert?: () => Promise<boolean>
  eligible?: boolean
  conversionDeadline?: Date | null
  conversionStartDate?: Date | null
  proof?: string[]
  convertableBalance?: string | null
  transactionHash?: string | null
}

const TokenConversion = (): JSX.Element => {
  const {
    approve,
    convert,
    getAllowance,
    eligible,
    conversionDeadline,
    convertableBalance,
  } = useTokenConversion()
  const { long: userAddress } = useWalletAddress()
  const vnlV1Address = isAddress(getVnlTokenAddress(VanillaVersion.V1_0))
  const vnlV2Address = isAddress(getVnlTokenAddress(VanillaVersion.V1_1))
  const [conversionState, setConversionState] =
    useRecoilState(tokenConversionState)
  const { addTransaction } = useAllTransactions()
  const [transactionHash, setTransactionHash] = useState<string | null>(null)

  const approveCallback = useCallback(async () => {
    let approval = false
    try {
      const transaction = await approve()
      if (transaction && vnlV1Address && vnlV2Address) {
        setTransactionHash(transaction.hash)
        const transactionDetails: TransactionDetails = {
          hash: transaction.hash,
          from: userAddress,
          action: Action.APPROVAL,
          approval: { tokenAddress: vnlV1Address, spender: vnlV2Address },
        }
        addTransaction(transactionDetails)
        approval = true
      }
    } catch (e) {
      console.error(e)
      return approval
    }
    return approval
  }, [addTransaction, vnlV1Address, approve, userAddress, vnlV2Address])

  const runConversion = useCallback(async () => {
    let conversionSuccessful = false
    try {
      const transaction = await convert()
      if (transaction) {
        setTransactionHash(transaction.hash)
        const transactionDetails: TransactionDetails = {
          hash: transaction.hash,
          from: userAddress,
          action: Action.CONVERSION,
        }
        addTransaction(transactionDetails)
        conversionSuccessful = true
      }
    } catch (e) {
      console.error(e)
      return conversionSuccessful
    }
    return conversionSuccessful
  }, [addTransaction, convert, userAddress])

  useEffect(() => {
    console.log(
      'balance: ',
      convertableBalance,
      ' eligibility: ',
      eligible,
      'conversionState: ',
      conversionState,
    )
    if (eligible && convertableBalance !== '0') {
      setConversionState(ConversionState.AVAILABLE)

      const checkAllowance = async () => {
        try {
          const allowance = await getAllowance()
          if (!allowance.isZero()) {
            setConversionState(ConversionState.APPROVED)
          }
        } catch (e) {
          console.error(e)
        }
      }
      checkAllowance()
    }
    return () => {
      setConversionState(ConversionState.HIDDEN)
    }
  }, [convertableBalance, eligible, getAllowance, setConversionState])

  const getView = useCallback(
    (conversionState: ConversionState): JSX.Element => {
      let view: JSX.Element
      switch (conversionState) {
        case ConversionState.AVAILABLE:
          view = (
            <Available
              conversionDeadline={conversionDeadline}
              convertableBalance={convertableBalance}
            />
          )
          break
        case ConversionState.READY:
          view = <Ready />
          break
        case ConversionState.APPROVING:
          view = <Approving approve={approveCallback} />
          break
        case ConversionState.APPROVED:
          view = (
            <Approved
              transactionHash={transactionHash}
              convert={runConversion}
            />
          )
          break
        case ConversionState.MINTED:
          view = <Minted transactionHash={transactionHash} />
          break
        default:
          view = <Available />
      }
      return view
    },
    [
      approveCallback,
      conversionDeadline,
      convertableBalance,
      runConversion,
      transactionHash,
    ],
  )

  return (
    <>
      <section
        className={
          conversionState === ConversionState.HIDDEN ? 'hidden' : undefined
        }
      >
        <Wrapper>
          <div className='innerPadding'>{getView(conversionState)}</div>
        </Wrapper>
      </section>
      <style jsx>{`
        section {
          width: 100%;
          position: relative;
          display: flex;
          min-height: 111px;
          background: linear-gradient(
            129.62deg,
            #ffe7a7 -6.97%,
            #f8f6f1 110.27%
          );
          margin-top: 1rem;
          border-top: 1px solid #000000;
          border-bottom: 1px solid #000000;
          align-items: center;
          justify-content: center;
          padding: var(--headerpadding);
          line-height: 2rem;
        }
        .hidden {
          display: none;
        }
        .innerPadding {
          padding: var(--headerpadding);
          padding-top: 0;
          padding-bottom: 0;
        }
      `}</style>
    </>
  )
}

export default TokenConversion
