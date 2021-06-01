import React from 'react'
import { Alignment, Column, Justification, Row } from './grid/Flex'
import Button from './input/Button'
import Wrapper from './Wrapper'
import VanillaV1Converter from 'types/abis/VanillaV1Converter'

const TokenConversion = (): JSX.Element => {

  return (
    <>
      <section>
        <Wrapper>
          <div className='innerPadding'>
            <Row alignItems={Alignment.STRETCH}>
              <Column grow={true}>
                <h2>15 days left to convert your tokens (21.6.2021)</h2>
                <span>
                  You could still convert your 20.256 VNL 1.0 to version 1.1.
                  Read more
                </span>
              </Column>
              <Column shrink={true} justifyContent={Justification.CENTER}>
                <Button>Convert now</Button>
              </Column>
            </Row>
          </div>
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
        h2 {
          margin: 0;
          padding: 0;
          text-transform: uppercase;
          font-size: 1.2rem;
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
