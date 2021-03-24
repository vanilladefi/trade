import React from 'react'

import Layout from '../components/Layout'
import Wrapper from '../components/Wrapper'
import { Title } from '../components/typography/Titles'
import ShillKitList from '../components/ShillKitList'

const ShillKit = (): JSX.Element => {
  return (
    <Layout title='Shill Kit'>
      <Wrapper>
        <div style={{ padding: '1rem' }}>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--titlefont)' }}>
            Shill kit
          </h1>
          <ShillKitList />
        </div>
      </Wrapper>
    </Layout>
  )
}

export default ShillKit
