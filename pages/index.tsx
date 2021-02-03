import Image from 'next/image'
import HandFlower from '../components/backgrounds/handflower'
import BoxSection, { Color, SeriousBox } from '../components/BoxSection'
import { Column, Row, Width } from '../components/grid/Flex'
import { GridItem, GridTemplate } from '../components/grid/Grid'
import Button from '../components/input/Button'
import Layout from '../components/Layout'
import Timeline from '../components/Timeline'
import HugeMonospace from '../components/typography/HugeMonospace'
import { Highlight } from '../components/typography/Text'
import { Title } from '../components/typography/Titles'
import Wrapper from '../components/Wrapper'
import Flower from '../components/Flower'

const HeaderContent = (
  <div className='heroContainer'>
    <Column className='landingHero'>
      <Row>
        <Column width={Width.TEN}>
          <Title>Vanilla Rewards You For Making a Profit In DeFi</Title>
          <HugeMonospace>Trade, lend, profit.</HugeMonospace>
          <Button>Start trading</Button>
        </Column>
      </Row>
    </Column>
    <Flower
      asBackground
      color={['#2C1929']}
      maxSize='500px'
      minSize='100vw'
      seed={Math.random() * 1337}
      hasProfitCurve
      className='heroFlower'
    />
    <style jsx>{`
      .heroFlower {
        right: 0;
        bottom: -20px;
      }
      .heroContainer {
        position: relative;
      }
      .landingHero {
        --titlesize: var(--landing-hugetitlesize);
        --titlemargin: var(--landing-titlemargin);
        --buttonmargin: var(--landing-buttonmargin);
        --titlecolor: var(--dark);
        max-width: 45rem;
      }
    `}</style>
  </div>
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
      <div className='miningWrapper'>
        <BoxSection color={Color.DARK}>
          <div className='whiteFlowers'>
            <Flower
              asBackground
              color={['#FFFFFF']}
              maxSize='400px'
              minSize='80vw'
              seed={Math.random() * 12566}
              className='whiteFlowers'
            />
          </div>

          <div className='whiteFlowers2'>
            <Flower
              asBackground
              color={['#FFFFFF']}
              maxSize='400px'
              minSize='80vw'
              seed={Math.random() * 12566}
              className='whiteFlowers'
            />
          </div>

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
              <Button>Learn more</Button>
            </Column>
          </Row>
        </BoxSection>
      </div>
      <style jsx>{`
        .whiteFlowers,
        .whiteFlowers2 {
          position: absolute;

          width: 400px;
          height: 400px;
        }
        .whiteFlowers {
          left: -180px;
          bottom: -40px;
        }
        .whiteFlowers2 {
          bottom: auto;
          top: 0px;
          left: 0px;
        }
        .miningWrapper {
          position: relative;
          overflow: hidden;
        }
      `}</style>
    </Wrapper>
    <Wrapper>
      <BoxSection color={Color.GRADIENT}>
        <div style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              borderBottom: '1px solid #2C1929',
              padding: '0 0 3vw 0',
            }}
          >
            <Column width={Width.SIX}>
              <Title>Trade</Title>
              <p>Trade tokens through decentralised exchanges.</p>
            </Column>
            <Column width={Width.SIX} style={{ alignItems: 'center' }}>
              <Image
                src='/images/illustration_trade.svg'
                alt='Staking Infographic'
                height='240px'
                width='260px'
              />
            </Column>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid #2C1929',
              padding: '3vw 0',
            }}
          >
            <Column width={Width.SIX} style={{ alignItems: 'center' }}>
              <Image
                src='/images/illustration_lend.svg'
                alt='Staking Infographic'
                height='240px'
                width='260px'
              />
            </Column>
            <Column width={Width.SIX}>
              <Title>Lend</Title>
              <p>
                Earn interest on your tokens using decentralised lending
                protocols.
              </p>
            </Column>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '3vw 0 0 0',
            }}
          >
            <Column width={Width.SIX}>
              <Title>Automate</Title>
              <p>
                Optimize your portfolio with decentralised automation systems.
              </p>
            </Column>
            <Column width={Width.SIX} style={{ alignItems: 'center' }}>
              <Image
                src='/images/illustration_automate.svg'
                alt='Staking Infographic'
                height='240px'
                width='260px'
              />
            </Column>
          </div>
        </div>
      </BoxSection>
    </Wrapper>

    <Wrapper>
      <BoxSection color={Color.DARK}>
        <HandFlower />
        <Row>
          <Column>
            <Title>
              VNL is the governance token of the Vanilla economic system.
            </Title>
            <Highlight>
              Holders of VNL determine the direction of Vanilla by voting on
              incentive changes, system upgrades and treasury allocations.
            </Highlight>
            <br />
            <Button>Learn more</Button>
          </Column>
        </Row>
      </BoxSection>
    </Wrapper>

    <BoxSection color={Color.WHITE} nosidepadding>
      <div className='timelinebox'>
        <Wrapper className='timelinewrapper'>
          <div className='centered'>
            <Title>Roadmap</Title>
          </div>
        </Wrapper>
        <Timeline milestones={milestones} />
      </div>
      <style jsx>{`
        .timelinebox {
          display: flex;
          width: 100%;
          position: relative;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .timelinewrapper {
          justify-self: center;
        }
        .centered {
          width: 100%;
          justify-content: center;
          padding: var(--boxpadding);
          padding-top: 0;
          padding-bottom: 0;
        }
        .profitMiningHeader {
          color: red;
        }
      `}</style>
    </BoxSection>

    <Wrapper>
      <BoxSection color={Color.GRADIENT}>
        <Column>
          <Row>
            <Column width={Width.FIVE}>
              <Title>Security</Title>
            </Column>
            <Column width={Width.SEVEN}>
              <Highlight>
                All Vanilla smart contracts have been thoroughly audited and
                there is a public bug bounty, but Vanilla is still beta
                software. Use at your own risk.
              </Highlight>
            </Column>
          </Row>
          <GridTemplate gap={'66px'}>
            <GridItem>
              <SeriousBox>
                <Title>Audit</Title>
              </SeriousBox>
            </GridItem>
            <GridItem>
              <SeriousBox>
                <Title>Bug Bounty</Title>
              </SeriousBox>
            </GridItem>
          </GridTemplate>
        </Column>
      </BoxSection>
    </Wrapper>
  </Layout>
)

export default IndexPage
