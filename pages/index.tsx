import Image from 'next/image'
import HandFlower from '../components/backgrounds/handflower'
import BoxSection, { Color, SeriousBox } from '../components/BoxSection'
import { Column, Row, Width } from '../components/grid/Flex'
import { GridItem, GridTemplate } from '../components/grid/Grid'
import Button, { ButtonSize } from '../components/input/Button'
import Layout from '../components/Layout'
import Timeline from '../components/Timeline'
import HugeMonospace from '../components/typography/HugeMonospace'
import { Highlight } from '../components/typography/Text'
import { Title } from '../components/typography/Titles'
import Wrapper from '../components/Wrapper'
import Flower from '../components/Flower'

const HeaderContent = (
  <>
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
      stems={12}
      iterations={10}
      color='#000000'
      maxSize='600px'
      minSize='100vw'
      seed={Math.random() * 1337}
      className='heroFlower'
    />
    <style jsx>{`
      .heroFlower {
        right: 0;
        bottom: 0;
      }
      .landingHero {
        --titlesize: var(--landing-hugetitlesize);
        --titlemargin: var(--landing-titlemargin);
        --buttonmargin: var(--landing-buttonmargin);
        --titlecolor: var(--dark);
        max-width: 45rem;
      }
    `}</style>
  </>
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
              stems={14}
              iterations={15}
              color='#FFFFFF'
              maxSize='600px'
              minSize='80vw'
              seed={Math.random() * 1256666}
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
        .whiteFlowers {
          position: absolute;
          left: -200px;
          width: 600px;
          height: 600px;
          bottom: 0;
        }
        .miningWrapper {
          position: relative;
        }
      `}</style>
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
            <Column
              width={Width.SIX}
              className='stakingInfo'
              style={{ mixBlendMode: 'darken' }}
            >
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
            <Button size={ButtonSize.LARGE}>Learn more</Button>
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
