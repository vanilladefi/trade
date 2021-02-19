import React from 'react'

import Layout from '../components/Layout'
import Wrapper from '../components/Wrapper'
import { Title } from '../components/typography/Titles'
import { BreakPoint } from '../components/GlobalStyles/Breakpoints'

const shills = [
  {
    description: '#ProfitMining, good',
    url: '/shill/vnl--blossomman.gif',
    type: 'animated',
  },
  {
    description: 'Just chilling, and mining',
    url: '/shill/vnl--chillingandmining.jpg',
    type: 'image',
  },
  {
    description: 'Cup of profit',
    url: '/shill/vnl--cupofprofit.jpg',
    type: 'image',
  },
  {
    description: 'Do you even #ProfitMine, bro?',
    url: '/shill/vnl--doyoueven.jpg',
    type: 'image',
  },
  {
    description: 'Lit',
    url: '/shill/vnl--fire.gif',
    type: 'animated',
  },
  {
    description: 'Splash',
    url: '/shill/vnl--ink.gif',
    type: 'animated',
  },
  {
    description: 'Get inspired',
    url: '/shill/vnl--inspirational.jpg',
    type: 'image',
  },
  {
    description: 'Live Laugh #ProfitMine',
    url: '/shill/vnl--livelaughprofitmine.jpg',
    type: 'image',
  },
  {
    description: 'New cool kid on the scene',
    url: '/shill/vnl--miner.gif',
    type: 'animated',
  },
  {
    description: 'Motivational',
    url: '/shill/vnl--motivational.jpg',
    type: 'image',
  },
  {
    description: 'Those profitmining feels',
    url: '/shill/vnl--profitminingfeels.gif',
    type: 'animated',
  },
  {
    description: 'Yes, Thumbs up for ProfitMining',
    url: '/shill/vnl--thumbsup.gif',
    type: 'animated',
  },
  {
    description: 'Ride the wave',
    url: '/shill/vnl--wave.jpg',
    type: 'image',
  },
  {
    description: 'Working hard',
    url: '/shill/vnl--working.gif',
    type: 'animated',
  },
  {
    description: 'Yo dawg',
    url: '/shill/vnl--yodawg.jpg',
    type: 'image',
  },
]

const ShillKit = (): JSX.Element => {
  return (
    <Layout title='Shill Kit'>
      <Wrapper>
        <div style={{ padding: '1rem' }}>
          <Title>Shill kit</Title>
        </div>
        <div
          className='galleryContainer'
          style={{
            columnGap: '1rem',
            paddingBottom: 'rem',
          }}
        >
          {shills.map((shill) => (
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
