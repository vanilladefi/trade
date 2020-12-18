import Layout from '../components/Layout'

import Wrapper from '../components/Wrapper'
import Flower from '../components/Flower'

const FlowerPage = (): JSX.Element => (
  <Layout title='VNL Flower Demo'>
    <Wrapper>
      <div style={{ margin: '2rem auto' }}>
        <Flower
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          stems={14}
          iterations={20}
          color='#000000'
          maxSize={600}
          seed={1256666}
          showDevTools
        />
      </div>
    </Wrapper>
  </Layout>
)

export default FlowerPage
