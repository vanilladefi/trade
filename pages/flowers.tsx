import React from 'react'
import { useRouter } from 'next/router'

import Layout from '../components/Layout'
import Wrapper from '../components/Wrapper'
import Flower from '../components/Flower'

const FlowerPage = (): JSX.Element => {
  const router = useRouter()

  const seed = router.query.seed
    ? Math.floor(Number(router.query.seed))
    : 123456
  const stems = router.query.stems ? Math.floor(Number(router.query.stems)) : 11

  const iterations = router.query.iterations
    ? Math.floor(Number(router.query.iterations))
    : 14

  const particleCount = router.query.particleCount
    ? Math.floor(Number(router.query.particleCount))
    : 100

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
            particleCount={particleCount}
            topLeft={`Seed ${seed}`}
            topRight={`Iterations ${iterations}`}
            bottomLeft={`Stems ${stems}`}
            bottomRight='Flower dev'
            allowExport
          />
        </div>
      </Wrapper>
    </Layout>
  )
}

export default FlowerPage
