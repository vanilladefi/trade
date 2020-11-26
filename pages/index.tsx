import BoxSection, { Color } from '../components/BoxSection'
import { Row, Column, Width } from '../components/grid/Flex'
import Button from '../components/input/Button'
import Layout from '../components/Layout'
import HugeMonospace from '../components/typography/HugeMonospace'
import { LandingTitle } from '../components/typography/Titles'
import Wrapper from '../components/Wrapper'

const HeaderContent = (
  <Column>
    <Row>
      <Column width={Width.NINE}>
        <LandingTitle>Vanilla Rewards You For Making a Profit</LandingTitle>
      </Column>
    </Row>
    <Row>
      <Column width={Width.EIGHT}>
        <HugeMonospace>
          Trade any token on Uniswap and receive ~5% in extra profit
        </HugeMonospace>
        <Button large injectedStyles={'margin-bottom: 90px;'}>
          Start trading
        </Button>
      </Column>
    </Row>
  </Column>
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
