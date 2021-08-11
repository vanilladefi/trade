import {
  Alignment,
  Column,
  Justification,
  Row,
  Width,
} from 'components/grid/Flex'
import Button from 'components/input/Button'
import Icon, { IconUrls } from 'components/typography/Icon'
import useTokenConversion from 'hooks/useTokenConversion'
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { tokenConversionState } from 'state/migration'
import { ConversionState } from 'types/migration'

const ErrorView = (): JSX.Element => {
  const { eligible, conversionDeadline } = useTokenConversion()
  const setTokenConversionState = useSetRecoilState(tokenConversionState)

  const [errorTitle, setErrorTitle] = useState('')
  const [errorSubtitle, setErrorSubtitle] = useState('')
  const [nextConversionState, setNextConversionState] = useState(
    ConversionState.AVAILABLE,
  )

  useEffect(() => {
    if (!eligible && conversionDeadline) {
      setErrorTitle('Tokens not found in the latest snapshot')
      setErrorSubtitle(
        'Your tokens were not in the most recent token state snapshot. Please try again after a week.',
      )
      setNextConversionState(ConversionState.HIDDEN)
    } else if (!conversionDeadline) {
      setErrorTitle('Migration not started yet')
      setErrorSubtitle(
        'Deployment still pending, sorry! Please check back soon.',
      )
      setNextConversionState(ConversionState.HIDDEN)
    } else if (eligible && conversionDeadline <= new Date(Date.now())) {
      setErrorTitle('Migration no longer available')
      setErrorSubtitle('The deadline for conversion has passed.')
      setNextConversionState(ConversionState.HIDDEN)
    } else {
      setErrorTitle('Transaction error')
      setErrorSubtitle(
        'Your transaction did not get executed, please try again and double check that you have enough gas.',
      )
      setNextConversionState(ConversionState.AVAILABLE)
    }
  }, [eligible, conversionDeadline])

  return (
    <>
      <Row alignItems={Alignment.STRETCH}>
        <Column grow={true} width={Width.EIGHT}>
          <h2>
            <Icon src={IconUrls.ALERT} />
            {errorTitle}
          </h2>
          <span>{errorSubtitle}</span>
        </Column>
        <Column
          justifyContent={Justification.CENTER}
          width={Width.FOUR}
          alignItems={Alignment.END}
        >
          <Button onClick={() => setTokenConversionState(nextConversionState)}>
            Back
          </Button>
        </Column>
      </Row>

      <style jsx>{`
        h2 {
          margin: 0;
          padding: 0;
          text-transform: uppercase;
          font-size: 1.2rem;
          display: flex;
          flex-direction: row;
          align-items: center;
          color: var(--alertcolor);
          --iconsize: 1.5rem;
        }
      `}</style>
    </>
  )
}

export default ErrorView
