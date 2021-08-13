import {
  Alignment,
  Column,
  Justification,
  Row,
  Width,
} from 'components/grid/Flex'
import Button from 'components/input/Button'
import { differenceInDays, format } from 'date-fns'
import useTokenConversion from 'hooks/useTokenConversion'
import React, { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'
import { tokenConversionState } from 'state/migration'
import { ConversionState } from 'types/migration'

const Available = (): JSX.Element => {
  const { conversionDeadline, convertableBalance } = useTokenConversion()
  const setTokenConversionState = useSetRecoilState(tokenConversionState)
  const calculateDaysToDeadline = useCallback(() => {
    let daysToDeadline = 0
    if (conversionDeadline) {
      daysToDeadline = differenceInDays(conversionDeadline, Date.now())
    }
    return daysToDeadline
  }, [conversionDeadline])
  return (
    <Row alignItems={Alignment.STRETCH}>
      <Column grow={true}>
        <h2>
          {calculateDaysToDeadline()} days left to convert your tokens (
          {conversionDeadline && format(conversionDeadline, 'dd.MM.yyyy')})
        </h2>
        <span>
          You could still convert your {convertableBalance} VNL 1.0 to version
          1.1.{' '}
          <a
            href='https://medium.com/vanilladefi/vanilla-v1-1-announcement-migration-instructions-d92239db5b'
            target='_blank'
            rel='noreferrer'
          >
            Read more.
          </a>
        </span>
      </Column>
      <Column
        justifyContent={Justification.CENTER}
        width={Width.FOUR}
        alignItems={Alignment.END}
      >
        <Button
          onClick={() => {
            setTokenConversionState(ConversionState.READY)
          }}
        >
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
