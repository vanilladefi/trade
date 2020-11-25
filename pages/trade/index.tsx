import Button from '../../components/input/Button'
import BoxSection, { Color } from '../../components/BoxSection'
import Layout from '../../components/Layout'
import HugeMonospace from '../../components/typography/HugeMonospace'
import Wrapper from '../../components/Wrapper'
import Gradient from '../../components/backgrounds/gradient'

const HeaderContent: JSX.Element = (
  <section>
    <Gradient />
    <h1>Start Trading</h1>
    <HugeMonospace>
      Make trades, see your profits blossom and mine VNL.
    </HugeMonospace>
    <Button large={true}>Connect wallet</Button>
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
