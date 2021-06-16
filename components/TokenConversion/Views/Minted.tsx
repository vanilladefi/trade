import {
  Alignment,
  Column,
  Justification,
  Row,
  Width,
} from 'components/grid/Flex'
import Button from 'components/input/Button'
import { Spinner } from 'components/Spinner'
import useTransaction from 'hooks/useTransaction'
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { tokenConversionState } from 'state/migration'
import { VanillaVersion } from 'types/general'
import { ConversionState } from 'types/migration'
import { ConversionViewProps } from '..'

const Minted = ({ transactionHash }: ConversionViewProps): JSX.Element => {
  const setTokenConversionState = useSetRecoilState(tokenConversionState)
  const [waiting, setWaiting] = useState(true)
  const transaction = useTransaction(VanillaVersion.V1_1, transactionHash || '')

  useEffect(() => {
    if (transactionHash && transaction?.receipt) {
      console.log(transaction)
      setWaiting(false)
    }
    return () => {
      setWaiting(true)
    }
  }, [transactionHash, transaction])

  return (
    <Row alignItems={Alignment.STRETCH}>
      {waiting ? (
        <Column grow={true} width={Width.TWELVE}>
          <Spinner />
          <h2>WAITING FOR TRANSACTION</h2>
        </Column>
      ) : (
        <>
          <Column grow={true} width={Width.EIGHT}>
            <h2>SUCCESSFULLY MINTED 20.256 TOKENS</h2>
            <span>You have converted 20.256 VNL to Vanilla 1.1. Hooray!</span>
          </Column>
          <Column
            justifyContent={Justification.CENTER}
            width={Width.FOUR}
            alignItems={Alignment.END}
          >
            <Button
              onClick={() => setTokenConversionState(ConversionState.HIDDEN)}
            >
              Close
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

export default Minted
