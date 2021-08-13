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
import useTransaction from 'hooks/useTransaction'
import React, { useCallback, useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { tokenConversionState } from 'state/migration'
import { VanillaVersion } from 'types/general'
import { ConversionState } from 'types/migration'
import { vnlDecimals } from 'utils/config'
import { ConversionViewProps } from '..'

const Minted = ({ transactionHash }: ConversionViewProps): JSX.Element => {
  const setTokenConversionState = useSetRecoilState(tokenConversionState)
  const [waiting, setWaiting] = useState(true)
  const transaction = useTransaction(VanillaVersion.V1_1, transactionHash || '')

  useEffect(() => {
    if (transactionHash && transaction?.receipt) {
      setWaiting(false)
    }
    return () => {
      setWaiting(true)
    }
  }, [transactionHash, transaction])

  const getAmountConverted = useCallback(() => {
    if (transaction?.amountConverted) {
      return formatUnits(transaction.amountConverted, vnlDecimals)
    }
    return '0'
  }, [transaction])

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
            <h2>SUCCESSFULLY MINTED {getAmountConverted()} TOKENS</h2>
            <span>
              You have converted {getAmountConverted()} VNL to Vanilla 1.1.
              Hooray!
            </span>
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
        --iconsize: 1rem;
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
