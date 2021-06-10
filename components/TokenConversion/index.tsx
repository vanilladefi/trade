import useTokenConversion from 'hooks/useTokenConversion'
import useVanillaGovernanceToken from 'hooks/useVanillaGovernanceToken'
import React, { useCallback, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { tokenConversionState } from 'state/migration'
import { VanillaVersion } from 'types/general'
import { ConversionState } from 'types/migration'
import Wrapper from '../Wrapper'
import { Approved, Approving, Available, Minted, Ready } from './Views'

export type ConversionViewProps = {
  eligible?: boolean
  conversionDeadline?: Date
  proof?: string[]
}

const TokenConversion = (): JSX.Element => {
  const { eligible, conversionDeadline, proof } = useTokenConversion()
  const { balance } = useVanillaGovernanceToken(VanillaVersion.V1_0)
  const [conversionState, setConversionState] = useRecoilState(
    tokenConversionState,
  )
  useEffect(() => {
    if (eligible && balance !== '0') {
      setConversionState(ConversionState.AVAILABLE)
    }
    return () => {
      setConversionState(ConversionState.HIDDEN)
    }
  }, [balance, eligible, setConversionState])

  const getView = useCallback(
    (conversionState: ConversionState): JSX.Element => {
      let view: JSX.Element
      switch (conversionState) {
        case ConversionState.AVAILABLE:
          view = <Available conversionDeadline={conversionDeadline} />
          break
        case ConversionState.READY:
          view = <Ready />
          break
        case ConversionState.APPROVING:
          view = <Approving />
          break
        case ConversionState.APPROVED:
          view = <Approved />
          break
        case ConversionState.MINTED:
          view = <Minted />
          break
        default:
          view = <Available />
      }
      return view
    },
    [],
  )

  return (
    <>
      <section
        className={
          conversionState === ConversionState.HIDDEN ? 'hidden' : undefined
        }
      >
        <Wrapper>
          <div className='innerPadding'>{getView(conversionState)}</div>
        </Wrapper>
      </section>
      <style jsx>{`
        section {
          width: 100%;
          position: relative;
          display: flex;
          min-height: 111px;
          background: linear-gradient(
            129.62deg,
            #ffe7a7 -6.97%,
            #f8f6f1 110.27%
          );
          margin-top: 1rem;
          border-top: 1px solid #000000;
          border-bottom: 1px solid #000000;
          align-items: center;
          justify-content: center;
          padding: var(--headerpadding);
          line-height: 2rem;
        }
        .hidden {
          display: none;
        }
        .innerPadding {
          padding: var(--headerpadding);
          padding-top: 0;
          padding-bottom: 0;
        }
      `}</style>
    </>
  )
}

export default TokenConversion
