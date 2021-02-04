import React from 'react'
import router from 'next/router'

import Layout from '../components/Layout'
import Wrapper from '../components/Wrapper'
import Flower from '../components/Flower'

const FlowerPage = (): JSX.Element => {
  let seed = 123456
  let stems = 14
  let iterations = 11

  React.useEffect(() => {
    seed = router.query.seed ? Math.floor(Number(router.query.seed)) : seed
    iterations = router.query.iterations
      ? Math.floor(Number(router.query.iterations))
      : iterations
    stems = router.query.stems ? Math.floor(Number(router.query.stems)) : stems
  }, [])

  return (
    <Layout title='VNL Flower playground' hideFromSearch>
      <Wrapper>
        <div style={{ margin: '2rem auto' }}>
          <Flower
            stems={stems}
            iterations={iterations}
            color={['#000000']}
            minSize='80vw'
            maxSize='600px'
            seed={seed}
            topLeft={`Seed ${seed}`}
            topRight={`Iterations ${iterations}`}
            bottomLeft={`Stems ${stems}`}
            bottomRight='Flower dev'
          />
        </div>
      </Wrapper>
    </Layout>
  )
}

export default FlowerPage
