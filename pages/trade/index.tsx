import Button from '../../components/input/Button'
import BoxSection, { Color } from '../../components/BoxSection'
import Layout from '../../components/Layout'
import { Title } from '../../components/typography/Titles'
import HugeMonospace from '../../components/typography/HugeMonospace'
import Wrapper from '../../components/Wrapper'
import Gradient from '../../components/backgrounds/gradient'
import { Row, Column, Width } from '../../components/grid/Flex'

const HeaderContent: JSX.Element = (
  <>
    <Gradient />
    <Row>
      <Column width={Width.EIGHT}>
        <Title>Start Trading</Title>
        <HugeMonospace>
          Make trades, see your profits blossom and mine VNL.
        </HugeMonospace>
        <Button large injectedStyles={'margin-bottom: 76px;'}>
          Connect wallet
        </Button>
      </Column>
    </Row>
  </>
)

const TradePage = (): JSX.Element => (
  <Layout title='Trade | Vanilla' hero={HeaderContent}>
    <Wrapper>
      <BoxSection color={Color.WHITE}>
        <h1>List of tokens comes here</h1>
      </BoxSection>
    </Wrapper>
  </Layout>
)

export default TradePage
