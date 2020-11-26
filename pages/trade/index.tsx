import Button from '../../components/input/Button'
import BoxSection, { Color } from '../../components/BoxSection'
import Layout from '../../components/Layout'
import { Title } from '../../components/typography/Titles'
import HugeMonospace from '../../components/typography/HugeMonospace'
import Wrapper from '../../components/Wrapper'
import Gradient from '../../components/backgrounds/gradient'

const HeaderContent: JSX.Element = (
  <section>
    <Gradient />
    <Title>Start Trading</Title>
    <HugeMonospace>
      Make trades, see your profits blossom and mine VNL.
    </HugeMonospace>
    <Button large injectedStyles={'margin-bottom: 76px;'}>
      Connect wallet
    </Button>
  </section>
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
