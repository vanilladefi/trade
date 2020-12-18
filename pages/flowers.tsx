import Layout from '../components/Layout'

import Wrapper from '../components/Wrapper'
import Flower from '../components/Flower.tsx'

const FlowerPage = (): JSX.Element => (
  <Layout title='VNL Flower Demo'>
    <Wrapper>
      <div style={{ margin: '2rem auto' }}>
        <Flower
          stems={14}
          iterations={20}
          color='#000000'
          maxSize={600}
          seed={1256666}
        />
      </div>
    </Wrapper>
  </Layout>
)

export default FlowerPage
