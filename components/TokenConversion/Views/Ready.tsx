import {
  Alignment,
  Column,
  Justification,
  Row,
  Width,
} from 'components/grid/Flex'
import Button, { ButtonColor } from 'components/input/Button'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import { tokenConversionState } from 'state/migration'
import { ConversionState } from 'types/migration'

const Ready = (): JSX.Element => {
  const setTokenConversionState = useSetRecoilState(tokenConversionState)
  return (
    <Row alignItems={Alignment.STRETCH}>
      <Column grow={true} width={Width.EIGHT}>
        <h2>Start converting tokens from V1.0 to V1.1</h2>
        <ol>
          <li>
            We check your eligible tokens from the latest snapshot (no gas fees)
          </li>
          <li>Approve tokens for conversion</li>
          <li>
            Lock the V1.0 tokens, mint a corresponding amount of V1.1 tokens
          </li>
        </ol>
        <span>
          Please note: If you have profit mined VNL after [date], you’ll need to
          wait for the next weekly token state snapshot on [date] to convert
          those tokens
        </span>
      </Column>
      <Column
        justifyContent={Justification.CENTER}
        width={Width.FOUR}
        alignItems={Alignment.END}
      >
        <Button
          onClick={() => setTokenConversionState(ConversionState.APPROVING)}
        >
          Start
        </Button>
        <Button
          color={ButtonColor.TRANSPARENT}
          onClick={() => setTokenConversionState(ConversionState.AVAILABLE)}
        >
          Cancel
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

export default Ready
