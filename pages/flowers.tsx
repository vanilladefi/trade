import { useRouter } from 'next/router'
import React from 'react'
import Flower from '../components/Flower'
import Layout from '../components/Layout'
import Wrapper from '../components/Wrapper'

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

  const tradeURLData = (
    <>
      {'vanilladefi.com'}
      <br />
      {'0x55d97be881ae9313cf78ebe1c28b15e6269b5938cc78fa3734c3769587cf6e7e'}
    </>
  )

  return (
    <Layout title='VNL Flower playground' hideFromSearch>
      <Wrapper>
        <div style={{ margin: '2rem auto' }}>
          <Flower
            stems={stems}
            iterations={iterations}
            color={['#000000']}
            minWidth='80vw'
            minHeight='80vw'
            maxWidth='600px'
            maxHeight='600px'
            seed={seed}
            particleCount={particleCount}
            topLeft={`Seed ${seed}`}
            topRight={`Iterations ${iterations}`}
            bottomLeft={tradeURLData}
            bottomRight='Flower dev'
            allowExport
          />
        </div>
      </Wrapper>
    </Layout>
  )
}

export default FlowerPage
