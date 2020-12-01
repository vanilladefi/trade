import { useRouter } from 'next/router'
import Button from '../../components/input/Button'
import BoxSection, { Color } from '../../components/BoxSection'
import Layout from '../../components/Layout'
import { SmallTitle, Title } from '../../components/typography/Titles'
import HugeMonospace from '../../components/typography/HugeMonospace'
import Wrapper from '../../components/Wrapper'
import Gradient from '../../components/backgrounds/gradient'
import { Row, Column, Width } from '../../components/grid/Flex'

import Modal from '../../components/Modal'
import TradeFlower from '../../components/TradeFlower'

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

const ModalContent = (): JSX.Element => (
  <Column>
    <div>
      <SmallTitle>TRADE SUCCESSFUL!</SmallTitle>
    </div>
    <TradeFlower
      received={{ ticker: 'DAI', amount: 2.5 }}
      paid={{ ticker: 'ETH', amount: 0.0056572 }}
      tradeURL={{
        domain: 'vnl.com',
        transactionHash:
          '0x05c7cedb4b6a234a92fcc9e396661cbed6d89e301899af6569dae3ff32a48acb',
      }}
    />
    <div>
      <Column>
        <SmallTitle>SHARE FOR MORE VNL</SmallTitle>
        <span>Learn more</span>
      </Column>
      <span>links here</span>
    </div>
    <style jsx>{`
      div {
        display: flex;
        flex-direction: row;
        padding: 19px 17px;
        justify-content: space-between;
      }
    `}</style>
  </Column>
)

const Trade = (): JSX.Element => {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      <Modal open={!!id} onRequestClose={() => router.push('/trade')}>
        <ModalContent />
      </Modal>
      <Layout title='Trade | Vanilla' hero={HeaderContent}>
        <Wrapper>
          <BoxSection color={Color.WHITE}>
            <h1>List of tokens comes here</h1>
          </BoxSection>
        </Wrapper>
      </Layout>
    </>
  )
}

export default Trade
