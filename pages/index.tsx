import BoxSection, { Color } from '../components/BoxSection'
import Button from '../components/input/Button'
import Layout from '../components/Layout'
import HugeMonospace from '../components/typography/HugeMonospace'
import { HugeTitle } from '../components/typography/Titles'
import Wrapper from '../components/Wrapper'

const HeaderContent = (
  <>
    <section>
      <HugeTitle>Vanilla Rewards You For Making a Profit</HugeTitle>
      <HugeMonospace>
        Trade any token on Uniswap and receive ~5% in extra profit
      </HugeMonospace>
      <Button large injectedStyles={'margin-bottom: 90px;'}>
        Start trading
      </Button>
    </section>
  </>
)

const IndexPage = (): JSX.Element => (
  <Layout title='Vanilla' hero={HeaderContent}>
    <Wrapper>
      <BoxSection color={Color.DARK}>
        <h1>#ProfitMining</h1>
      </BoxSection>
    </Wrapper>
    <Wrapper>
      <BoxSection color={Color.GRADIENT}>
        <h1>VNL can be staked to increase rewards and direct capital flows.</h1>
      </BoxSection>
    </Wrapper>
  </Layout>
)

export default IndexPage
