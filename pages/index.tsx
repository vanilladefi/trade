import Image from 'next/image'
import BoxSection, { Color } from '../components/BoxSection'
import { Row, Column, Width } from '../components/grid/Flex'
import Button from '../components/input/Button'
import Layout from '../components/Layout'
import Timeline from '../components/Timeline'
import HugeMonospace from '../components/typography/HugeMonospace'
import { Highlight } from '../components/typography/Text'
import { Title } from '../components/typography/Titles'
import Wrapper from '../components/Wrapper'

const HeaderContent = (
  <Column className='landingHero'>
    <Row>
      <Column width={Width.NINE}>
        <Title>Vanilla Rewards You For Making a Profit</Title>
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
    <style jsx>{`
      .landingHero {
        --titlesize: var(--landing-hugetitlesize);
        --titlemargin: var(--landing-titlemargin);
        --buttonmargin: var(--landing-buttonmargin);
      }
    `}</style>
  </Column>
)

const milestones = [
  { name: 'Profit Mining', time: 'Live' },
  { name: 'Staking', time: 'Q2' },
  { name: 'Governance', time: 'Q4' },
  { name: 'Funds', time: 'Q1' },
]

const IndexPage = (): JSX.Element => (
  <Layout title='Vanilla' hero={HeaderContent}>
    <Wrapper>
      <BoxSection color={Color.DARK}>
        <Row>
          <Column width={Width.FOUR}></Column>
          <Column width={Width.EIGHT} className='profitMiningHeader'>
            <Title>#ProfitMining</Title>
            <HugeMonospace>
              Mine VNL by making a profit trading tokens through Vanilla
            </HugeMonospace>
            <p>
              Profit mining is the only way to create VNL tokens and mining
              difficulty increases as the amount of capital in the Vanilla
              system grows
            </p>
            <br />
            <Button large>Learn more</Button>
          </Column>
        </Row>
      </BoxSection>
    </Wrapper>

    <Wrapper>
      <BoxSection color={Color.GRADIENT}>
        <Row>
          <Column>
            <Title>
              VNL can be staked to increase rewards and direct capital flows.
            </Title>
          </Column>
          <Row>
            <Column width={Width.SIX}>
              <p>
                Anyone can stake VNL on themselves to increase their personal
                rewards. E.g. By staking 10 VNL on yourself, you can increase
                your rewards by ~5%
              </p>
            </Column>
            <Column width={Width.SIX}>
              <Image
                src='/images/stakinginfo.png'
                alt='Staking Infographic'
                height='337px'
                width='393px'
              />
            </Column>
          </Row>
        </Row>
      </BoxSection>
    </Wrapper>

    <Wrapper>
      <BoxSection color={Color.DARK}>
        <Row>
          <Column>
            <Title>
              VNL is the governance token of the Vanilla economic system.
            </Title>
          </Column>
          <Column width={Width.SIX}></Column>
          <Column width={Width.SIX}>
            <Highlight>
              Holders of VNL determine the direction of Vanilla by voting on
              incentive changes, system upgrades and treasury allocations.
            </Highlight>
            <br />
            <Button large>Learn more</Button>
          </Column>
        </Row>
      </BoxSection>
    </Wrapper>

    <BoxSection color={Color.WHITE} nosidepadding>
      <Column>
        <Row className='centered'>
          <Wrapper className='timelinewrapper'>
            <Title>Roadmap</Title>
          </Wrapper>
        </Row>
        <Timeline milestones={milestones} />
      </Column>
      <style jsx>{`
        .timelinewrapper {
          justify-self: center;
          --outermargin: calc(var(--outermargin) * 2);
        }
        .centered {
          width: 100%;
          justify-content: center;
        }
      `}</style>
    </BoxSection>

    <Wrapper>
      <BoxSection color={Color.GRADIENT}>
        <Row>
          <Column width={Width.FIVE}>
            <Title>Security</Title>
          </Column>
          <Column width={Width.SEVEN}>
            <Highlight>
              All Vanilla smart contracts have been thoroughly audited and there
              is a public bug bounty, but Vanilla is still beta software. Use at
              your own risk.
            </Highlight>
          </Column>
        </Row>
      </BoxSection>
    </Wrapper>
  </Layout>
)

export default IndexPage
