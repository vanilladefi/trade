import BoxSection, { Color } from '../components/BoxSection'
import { Row, Column, Width } from '../components/grid/Flex'
import Button from '../components/input/Button'
import Layout from '../components/Layout'
import HugeMonospace from '../components/typography/HugeMonospace'
import { BoxTitle, LandingTitle } from '../components/typography/Titles'
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
        <Row>
          <Column width={Width.FOUR}></Column>
          <Column width={Width.EIGHT}>
            <BoxTitle>#ProfitMining</BoxTitle>
            <HugeMonospace>
              Mine VNL by making a profit trading tokens through Vanilla
            </HugeMonospace>
            <p>
              Profit mining is the only way to create VNL tokens and mining
              difficulty increases as the amount of capital in the Vanilla
              system grows
            </p>
            <Button large>Learn more</Button>
          </Column>
        </Row>
      </BoxSection>
    </Wrapper>

    <Wrapper>
      <BoxSection color={Color.GRADIENT}>
        <Row>
          <Column>
            <BoxTitle>
              VNL can be staked to increase rewards and direct capital flows.
            </BoxTitle>
          </Column>
          <Column width={Width.SIX}>
            <p>
              Anyone can stake VNL on themselves to increase their personal
              rewards. E.g. By staking 10 VNL on yourself, you can increase your
              rewards by ~5%
            </p>
          </Column>
        </Row>
      </BoxSection>
    </Wrapper>
  </Layout>
)

export default IndexPage
