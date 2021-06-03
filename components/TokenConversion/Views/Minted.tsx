import {
  Alignment,
  Column,
  Justification,
  Row,
  Width,
} from 'components/grid/Flex'
import Button from 'components/input/Button'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import { tokenConversionState } from 'state/migration'
import { ConversionState } from 'types/migration'

const Minted = (): JSX.Element => {
  const setTokenConversionState = useSetRecoilState(tokenConversionState)
  return (
    <Row alignItems={Alignment.STRETCH}>
      <Column grow={true} width={Width.EIGHT}>
        <h2>SUCCESSFULLY MINTED 20.256 TOKENS</h2>
        <span>You have converted 20.256 VNL to Vanilla 1.1. Hooray!</span>
      </Column>
      <Column
        justifyContent={Justification.CENTER}
        width={Width.FOUR}
        alignItems={Alignment.END}
      >
        <Button onClick={() => setTokenConversionState(ConversionState.HIDDEN)}>
          Close
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

export default Minted
