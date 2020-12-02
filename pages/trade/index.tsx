import Button from '../../components/input/Button'
import BoxSection, { Color } from '../../components/BoxSection'
import Layout from '../../components/Layout'
import { Title } from '../../components/typography/Titles'
import HugeMonospace from '../../components/typography/HugeMonospace'
import Wrapper from '../../components/Wrapper'
import Gradient from '../../components/backgrounds/gradient'
import { Row, Column, Width } from '../../components/grid/Flex'
import Link from 'next/link'

export const HeaderContent: JSX.Element = (
  <>
    <Gradient />
    <Row className='subpageHeader'>
      <Column width={Width.EIGHT}>
        <Title>Start Trading</Title>
        <HugeMonospace>
          Make trades, see your profits blossom and mine VNL.
        </HugeMonospace>
        <Button large>Connect wallet</Button>
      </Column>
    </Row>
    <style jsx>{`
      .subpageHeader {
        --buttonmargin: var(--subpage-buttonmargin);
        --titlemargin: var(--subpage-titlemargin);
      }
    `}</style>
  </>
)

export const BodyContent = (): JSX.Element => {
  return (
    <Wrapper>
      <BoxSection color={Color.WHITE}>
        <h1>List of tokens comes here</h1>
        <Link href='/trade/ebin'>Open latest trade</Link>
      </BoxSection>
    </Wrapper>
  )
}

const TradePage = (): JSX.Element => (
  <>
    <Layout title='Trade | Vanilla' hero={HeaderContent}>
      <BodyContent />
    </Layout>
  </>
)

export default TradePage
