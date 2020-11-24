import Link from 'next/link'
import Layout from '../components/Layout'
import HugeMonospace from '../components/typography/HugeMonospace'
import HugeTitle from '../components/typography/HugeTitle'

const HeaderContent = (
  <section><HugeTitle>Vanilla Rewards You For Making a Profit</HugeTitle><HugeMonospace>Trade any token on Uniswap and receive ~5% in extra profit</HugeMonospace></section>
)

const IndexPage = () => (
  <Layout title="Vanilla" hero={HeaderContent}>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
    <style jsx>{`
      a {
        color: red;
      }
    `}</style>
  </Layout>
)

export default IndexPage
