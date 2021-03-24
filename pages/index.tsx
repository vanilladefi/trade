import Image from 'next/image'
import Link from 'next/link'
import BoxSection, { Color } from '../components/BoxSection'
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
import { BreakPoint } from '../components/GlobalStyles/Breakpoints'
import ShillKitList from '../components/ShillKitList'

const HeaderContent = (
  <div className='heroContainer'>
    <Column className='landingHero'>
      <Row>
        <Column width={Width.TWELVE}>
          <Title>
            One Interface <br />
            For DeFi
          </Title>
          <HugeMonospace>
            Trade, lend and participate in #ProfitMining
          </HugeMonospace>
          <Link href='/trade'>
            <Button>Start trading</Button>
          </Link>
        </Column>
      </Row>
    </Column>
    <Flower
      asBackground
      color={['#2C1929']}
      minWidth='1000px'
      minHeight='450px'
      maxWidth='1000px'
      maxHeight='450px'
      seed={Math.random() * 1337}
      hasProfitCurve
      positionRight
      className='heroFlower'
    />
    <style jsx>{`
      .heroFlower {
        right: -40rem;
        bottom: -6.5rem;
        transform: scale(0.9);
        transform-origin: bottom center;
      }
      .heroContainer {
        position: relative;
      }
      .landingHero {
        --titlesize: 3rem;
        --titlemargin: 4vh 0 1.4rem 0;
        --buttonmargin: 0.5rem 0 10vh 0;
        padding-bottom: 0vh;
        max-width: 38rem;
        width: 70%;
      }
      @media (min-width: ${BreakPoint.sm}px) {
        .heroFlower {
          right: -30rem;
          bottom: -0.95rem;
          transform: scale(1);
        }
        .landingHero {
          --titlesize: 4rem;
          --titlemargin: 6vh 0 1.4rem;
          --buttonmargin: 0.5rem 0 10vh 0;
          --titlecolor: var(--dark);
          max-width: 34rem;
        }
      }

      @media (min-width: ${BreakPoint.md}px) {
        .heroFlower {
          right: -13%;
        }
      }

      @media (min-width: ${BreakPoint.lg}px) {
        .heroFlower {
          right: -15%;
        }
      }
    `}</style>
  </div>
)

const milestones = [
  { name: 'Profit Mining + Trading', time: 'Live' },
  { name: 'Governance', time: 'Q3' },
  { name: 'Lending ', time: 'Q4' },
  { name: 'TBD', time: 'Q1' },
]

const IndexPage = (): JSX.Element => (
  <Layout
    title='Start #ProfitMining'
    description='Vanilla Rewards You For Making a Profit In DeFi'
    hero={HeaderContent}
  >
    <Wrapper>
      <div className='miningWrapper'>
        <BoxSection color={Color.DARK}>
          <div className='flowerWrapper'>
            <div className='whiteFlower'>
              <Flower
                asBackground
                color={['#FFFFFF']}
                minWidth='80vw'
                minHeight='80vw'
                maxWidth='400px'
                maxHeight='400px'
                seed={Math.random() * 12566}
                className='whiteFlowers'
              />
            </div>

            <div className='whiteFlower2'>
              <Flower
                asBackground
                color={['#FFFFFF']}
                minWidth='80vw'
                minHeight='80vw'
                maxWidth='400px'
                maxHeight='400px'
                seed={Math.random() * 12566}
                className='whiteFlowers'
              />
            </div>
          </div>

          <div className='contentWrapper'>
            <Column width={Width.TWELVE} className='profitMiningHeader'>
              <Title>#ProfitMining</Title>
              <HugeMonospace>
                Mine VNL by making a profit trading tokens
              </HugeMonospace>
              <p>
                Profit mining is the only way to create VNL tokens and mining
                difficulty increases over time.
              </p>
              <br />
              <Link href='/faq'>
                <Button>Learn more</Button>
              </Link>
            </Column>
          </div>
        </BoxSection>
      </div>
      <style jsx>{`
        .whiteFlower,
        .whiteFlower2 {
          position: absolute;
          display: none;
          width: 400px;
          height: 400px;
        }
        .flowerWrapper {
          display: none;
          position: relative;
        }
        .miningWrapper {
          position: relative;
          overflow: hidden;
        }
        @media (min-width: ${BreakPoint.sm}px) {
        }

        @media (min-width: ${BreakPoint.md}px) {
          .whiteFlower {
            left: -210px;
            bottom: -130px;
            display: block;
          }
          .whiteFlower2 {
            top: -40px;
            left: -20px;
            display: block;
          }
          .flowerWrapper {
            width: 40%;
            display: block;
          }
          .contentWrapper {
            width: 60%;
          }
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
              alignItems: 'stretch',
              borderBottom: '1px solid #2C1929',
              flexWrap: 'wrap',
              padding: '0 0 3rem 0',
            }}
          >
            <div className='tradeLendAutomateContent'>
              <div className='titleStatus'>
                <Title>Trade</Title>
                <div className='tokenStatus'>
                  <div>
                    <Image
                      src='/images/tokens/uniswap.png'
                      width='48'
                      height='48'
                      alt='Uniswap'
                    />
                  </div>
                  <div className='tokenStatusContent'>
                    <span className='tokenStatus-token'>Uniswap</span>
                    <span className='tokenStatus-status'>
                      <strong>Live</strong>
                    </span>
                  </div>
                </div>
                <div className='tokenStatus tokenComingSoon'>
                  <div>
                    <Image
                      src='/images/tokens/balancer.png'
                      width='48'
                      height='48'
                      alt='Balancer'
                    />
                  </div>
                  <div className='tokenStatusContent'>
                    <span className='tokenStatus-token'>Balancer</span>
                    <span className='tokenStatus-status'>Soon</span>
                  </div>
                </div>
              </div>
              <p>Trade tokens through decentralised exchanges.</p>
            </div>
            <div className='tradeLendAutomateImage'>
              <Image
                src='/images/illustration_trade.svg'
                alt='Trading'
                height='240px'
                width='260px'
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'stretch',
              borderBottom: '1px solid #2C1929',
              flexWrap: 'wrap',
              padding: '3rem 0',
            }}
          >
            <div className='tradeLendAutomateImage'>
              <Image
                src='/images/illustration_lend.svg'
                alt='Lending'
                height='240px'
                width='260px'
              />
            </div>
            <div className='tradeLendAutomateContent'>
              <div className='titleStatus'>
                <Title>Lend</Title>
                <div style={{ display: 'flex' }}>
                  <div className='tokenStatus tokenComingSoon'>
                    <div>
                      <Image
                        src='/images/tokens/aave.png'
                        width='48'
                        height='48'
                        alt='Aave'
                      />
                    </div>
                    <div className='tokenStatusContent'>
                      <span className='tokenStatus-token'>Aave</span>
                      <span className='tokenStatus-status'>Soon</span>
                    </div>
                  </div>
                  <div className='tokenStatus tokenComingSoon'>
                    <div>
                      <Image
                        src='/images/tokens/compound.png'
                        width='48'
                        height='48'
                        alt='Compound'
                      />
                    </div>
                    <div className='tokenStatusContent'>
                      <span className='tokenStatus-token'>Compound</span>
                      <span className='tokenStatus-status'>Soon</span>
                    </div>
                  </div>
                </div>
              </div>
              <p>
                Earn interest on your tokens using decentralised lending
                protocols.
              </p>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'stretch',
              padding: '3rem 0 0 0',
              flexWrap: 'wrap',
            }}
          >
            <div className='tradeLendAutomateContent'>
              <div className='titleStatus'>
                <Title>Automate</Title>
              </div>
              <p>
                Build automated portfolio optimisation systems and decentralised
                financial instruments.
              </p>
            </div>
            <div className='tradeLendAutomateImage'>
              <Image
                src='/images/illustration_automate.svg'
                alt='Staking Infographic'
                height='240px'
                width='260px'
              />
            </div>
          </div>
        </div>
      </BoxSection>
      <style jsx>{`
        .tradeLendAutomateImage {
          order: 1;
          width: 30%;
          display: flex;
          align-items: flex-start;
          padding: 0 1.8rem 0 0;
        }
        .tradeLendAutomateContent {
          order: 2;
          width: 70%;
          display: flex;
          flex-direction: column;
        }
        .titleStatus {
          display: flex;
          margin-bottom: -1rem;
          flex-direction: column;
        }
        .tokenStatus {
          display: flex;
          margin-right: 1rem;
        }
        .tokenStatusContent {
          display: flex;
          flex-direction: column;
          text-transform: uppercase;
          align-items: left;
          justify-content: center;
          height: 48px;
          line-height: 1.15rem;
          font-size: 0.8rem;
          padding: 0.2rem 0.5rem;
        }
        @media (min-width: ${BreakPoint.md}px) {
          .tradeLendAutomateImage,
          .tradeLendAutomateContent {
            order: 0;
            width: 50%;
            justify-content: center;
          }
          .tradeLendAutomateImage {
            align-items: center;
          }

          .titleStatus {
            flex-direction: row;
          }
          .tokenStatus {
            display: flex;
            margin-left: 1.5rem;
            margin-right: 0;
          }
        }
      `}</style>
    </Wrapper>

    <Wrapper>
      <BoxSection color={Color.DARK}>
        <Row>
          <div
            className='governaceColumn governaceBg'
            style={{
              height: '480px',
              textAlign: 'center',
            }}
          >
            <div className='governaceFlowerHolder'>
              <Flower
                stems={15}
                iterations={10}
                color={['#ffde8e']}
                minWidth='100%'
                minHeight='480px'
                maxWidth='480px'
                maxHeight='480px'
                asBackground
                flowerSize={1.5}
                seed={Math.random() * 12566}
                background={`url('images/governace_token_holder.jpg')`}
              />
            </div>
          </div>
          <div className='governaceColumn'>
            <Title>
              VNL is the governance token of the Vanilla economic system.
            </Title>
            <Highlight>
              Holders of VNL determine the direction of Vanilla by voting on a
              variety of things such as changes to the profit mining algorithm,
              new trading and lending venues, treasury grant allocations and
              other ecosystem efforts.
            </Highlight>
            <br />
            <Button>Learn more</Button>
          </div>
        </Row>
      </BoxSection>
      <style jsx>{`
        .governaceColumn {
          position: relative;
          width: 100%;
        }
        .governaceFlowerHolder {
          position: relative;
          width: 100%;
          max-width: 480px;
          margin: calc(-1 * var(--boxpadding)) auto;
        }
        @media (min-width: ${BreakPoint.md}px) {
          .governaceFlowerHolder {
            margin: 0 0 0 calc(-0.4 * var(--boxpadding));
          }
          .governaceColumn {
            width: 50%;
            justify-content: center;
          
        }
      `}</style>
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
            <Column width={Width.TWELVE}>
              <Title>Security</Title>
              <p style={{ margin: '0 0 3rem' }}>
                All Vanilla smart contracts have been thoroughly audited and
                there is a public bug bounty, but Vanilla is still beta
                software. Use at your own risk.
              </p>
            </Column>
          </Row>
          <GridTemplate gap={'32px'} colMinWidth={'280px'}>
            <GridItem>
              <a
                href='https://github.com/vanilladefi/contracts/tree/main/audits'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  minWidth: '200px',
                  maxWidth: '20rem',
                  margin: '0 auto',
                }}
              >
                <Image
                  src='/images/audit-reports.svg'
                  width='400'
                  height='286'
                  alt='Audit Reports'
                />
              </a>
            </GridItem>
            <GridItem>
              <Link href='/bug-bounty'>
                <div
                  style={{
                    minWidth: '200px',
                    maxWidth: '20rem',
                    margin: '0 auto',
                  }}
                >
                  <Image
                    src='/images/bug-bounty.svg'
                    width='400'
                    height='286'
                    alt='Bug bounties'
                  />
                </div>
              </Link>
            </GridItem>
          </GridTemplate>
        </Column>
      </BoxSection>
    </Wrapper>

    <Wrapper>
      <BoxSection>
        <Title>Shill kit</Title>
        <ShillKitList />
      </BoxSection>
    </Wrapper>
  </Layout>
)

export default IndexPage
