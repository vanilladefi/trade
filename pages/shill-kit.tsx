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
          <Title>Shill kit</Title>
        </div>
      </Wrapper>
      <ShillKitList />
    </Layout>
  )
}

export default ShillKit
