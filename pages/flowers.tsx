import Layout from '../components/Layout'

import Wrapper from '../components/Wrapper'
import Flower from '../components/Flower'

const FlowerPage = (): JSX.Element => (
  <Layout title='VNL Flower Demo'>
    <Wrapper>
      <div style={{ margin: '2rem auto' }}>
        <Flower
          stems={14}
          iterations={20}
          color={['#000000']}
          minSize='80vw'
          maxSize='600px'
          seed={1256666}
          topLeft='Text here'
          topRight='Top Right'
          bottomLeft='Bottom left'
          bottomRight='Bottom right'
        />
      </div>
    </Wrapper>
  </Layout>
)

export default FlowerPage
