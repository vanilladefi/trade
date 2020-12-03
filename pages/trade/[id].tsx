import { useRouter } from 'next/router'
import { Column } from '../../components/grid/Flex'
import Layout from '../../components/Layout'
import Modal from '../../components/Modal'
import TradeFlower from '../../components/TradeFlower'
import { SmallTitle } from '../../components/typography/Titles'
import { BodyContent, HeaderContent } from './'



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
        <SmallTitle>Share for more VNL</SmallTitle>
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
        <BodyContent />
      </Layout>
    </>
  )
}

export default Trade
