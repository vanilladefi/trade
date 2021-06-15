import {
  Alignment,
  Column,
  Justification,
  Row,
  Width,
} from 'components/grid/Flex'
import Button from 'components/input/Button'
import { format } from 'date-fns'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import { tokenConversionState } from 'state/migration'
import { ConversionState } from 'types/migration'
import { ConversionViewProps } from '..'

const Available = ({
  conversionDeadline,
  convertableBalance,
}: ConversionViewProps): JSX.Element => {
  const setTokenConversionState = useSetRecoilState(tokenConversionState)
  return (
    <Row alignItems={Alignment.STRETCH}>
      <Column grow={true}>
        <h2>
          15 days left to convert your tokens (
          {conversionDeadline && format(conversionDeadline, 'dd.MM.yyyy')})
        </h2>
        <span>
          You could still convert your {convertableBalance} VNL 1.0 to version
          1.1. Read more
        </span>
      </Column>
      <Column
        justifyContent={Justification.CENTER}
        width={Width.FOUR}
        alignItems={Alignment.END}
      >
        <Button onClick={() => setTokenConversionState(ConversionState.READY)}>
          Convert now
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

export default Available
