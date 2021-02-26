import React from 'react'

import Layout from '../components/Layout'
import Wrapper from '../components/Wrapper'
import { Title } from '../components/typography/Titles'
import { BreakPoint } from '../components/GlobalStyles/Breakpoints'
import ShillKitList from '../components/ShillKitList'

const ShillKit = (): JSX.Element => {
  return (
    <Layout title='Shill Kit'>
      <Wrapper>
        <div style={{ padding: '1rem' }}>
          <Title>Shill kit</Title>
        </div>
        <div className='galleryContainer'>
          {ShillKitList.map((shill) => (
            <div
              style={{ width: '100%', maxWidth: '400px', padding: '0 0 .5rem' }}
            >
              <img
                style={{ width: '100%' }}
                src={shill.url}
                alt={shill.description}
              />
            </div>
          ))}
        </div>
      </Wrapper>
      <style jsx>{`
        .galleryContainer
        column-gap: 1.5em;
        column-count: 1;
        }
        @media (min-width: ${BreakPoint.sm}px) {
          .galleryContainer{
            column-count: 2;
          }
        }

        @media (min-width: ${BreakPoint.md}px) {
          .galleryContainer{
            column-count: 3;
          }
        }

      `}</style>
    </Layout>
  )
}

export default ShillKit
