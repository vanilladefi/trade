import {
  Alignment,
  Column,
  Justification,
  Row,
  Width,
} from 'components/grid/Flex'
import Button, { ButtonColor } from 'components/input/Button'
import useTokenConversion from 'hooks/useTokenConversion'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import { tokenConversionState } from 'state/migration'
import { ConversionState } from 'types/migration'
import { ConversionViewProps } from '..'

const Approving = ({ approve }: ConversionViewProps): JSX.Element => {
  const { convertableBalance } = useTokenConversion()
  const setTokenConversionState = useSetRecoilState(tokenConversionState)
  return (
    <Row alignItems={Alignment.STRETCH}>
      <Column grow={true} width={Width.EIGHT}>
        <h2>Approve token conversion</h2>
        <span>
          {convertableBalance} VNL can be converted to V1.1. This transaction
          can be canceled.
        </span>
      </Column>
      <Column
        justifyContent={Justification.CENTER}
        width={Width.FOUR}
        alignItems={Alignment.END}
      >
        <Button
          onClick={async () => {
            try {
              const approval = approve && (await approve())
              if (approval) {
                setTokenConversionState(ConversionState.APPROVED)
              }
            } catch (e) {
              setTokenConversionState(ConversionState.ERROR)
            }
          }}
        >
          Approve
        </Button>
        <Button
          color={ButtonColor.TRANSPARENT}
          onClick={() => setTokenConversionState(ConversionState.READY)}
        >
          Back
        </Button>
      </Column>
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

export default Approving
