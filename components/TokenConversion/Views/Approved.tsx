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

const Approved = (): JSX.Element => {
  const setTokenConversionState = useSetRecoilState(tokenConversionState)
  return (
    <Row alignItems={Alignment.STRETCH}>
      <Column grow={true} width={Width.EIGHT}>
        <h2>Mint V1.1 tokens</h2>
        <span>
          Mint 20.256 VNL 1.1 tokens? This transaction can’t be cancelled.
        </span>
      </Column>
      <Column
        justifyContent={Justification.CENTER}
        width={Width.FOUR}
        alignItems={Alignment.END}
      >
        <Button onClick={() => setTokenConversionState(ConversionState.MINTED)}>
          Mint
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

export default Approved
