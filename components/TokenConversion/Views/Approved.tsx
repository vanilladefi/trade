import {
  Alignment,
  Column,
  Justification,
  Row,
  Width,
} from 'components/grid/Flex'
import Button from 'components/input/Button'
import { Spinner } from 'components/Spinner'
import Spacer from 'components/typography/Spacer'
import { formatUnits } from 'ethers/lib/utils'
import useTokenConversion from 'hooks/useTokenConversion'
import useTransaction from 'hooks/useTransaction'
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { tokenConversionState } from 'state/migration'
import { VanillaVersion } from 'types/general'
import { ConversionState } from 'types/migration'
import { ConversionViewProps } from '..'

const Approved = ({
  transactionHash,
  convert,
}: ConversionViewProps): JSX.Element => {
  const { getAllowance } = useTokenConversion()
  const setTokenConversionState = useSetRecoilState(tokenConversionState)
  const [waiting, setWaiting] = useState<boolean>(true)
  const [allowance, setAllowance] = useState<string>('')
  const transaction = useTransaction(VanillaVersion.V1_1, transactionHash || '')

  useEffect(() => {
    const checkAllowance = async () => {
      try {
        const allowance = await getAllowance()
        if (!allowance.isZero()) {
          setWaiting(false)
        }
        const parsedAllowance = formatUnits(allowance, 12)
        setAllowance(parsedAllowance)
      } catch (e) {
        console.error(e)
      }
    }
    checkAllowance()
    if (transactionHash && transaction?.receipt) {
      setWaiting(false)
    }
    return () => {
      setWaiting(true)
    }
  }, [transactionHash, transaction, getAllowance])

  return (
    <Row alignItems={Alignment.STRETCH}>
      {waiting ? (
        <Column grow={true} width={Width.TWELVE}>
          <Row alignItems={Alignment.CENTER}>
            <Spinner />
            <Spacer />
            <h2>WAITING FOR TRANSACTION</h2>
          </Row>
        </Column>
      ) : (
        <>
          <Column grow={true} width={Width.EIGHT}>
            <h2>Mint V1.1 tokens</h2>
            <span>
              Mint {allowance} VNL 1.1 tokens? This transaction can’t be
              cancelled.
            </span>
          </Column>
          <Column
            justifyContent={Justification.CENTER}
            width={Width.FOUR}
            alignItems={Alignment.END}
          >
            <Button
              onClick={async () => {
                const conversionSuccessful = convert && (await convert())
                if (conversionSuccessful) {
                  setTokenConversionState(ConversionState.MINTED)
                }
              }}
            >
              Mint
            </Button>
          </Column>
        </>
      )}

      <style jsx>{`
        h2 {
          margin: 0;
          padding: 0;
          text-transform: uppercase;
          font-size: 1.2rem;
        }
      `}</style>
    </Row>
  )
}

export default Approved
