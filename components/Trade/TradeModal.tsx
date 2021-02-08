import Modal from 'components/Modal'
import { Column } from 'components/grid/Flex'
import { useWallet } from 'use-wallet'
import TradeFlower from 'components/TradeFlower'
import { buy, sell } from 'lib/trade'
import { providers } from 'ethers'
import { SmallTitle } from 'components/typography/Titles'
import Button from 'components/input/Button'

const ModalContent = (): JSX.Element => {
  const wallet = useWallet()
  return (
    <Column>
      <div>
        <SmallTitle>TRADE SUCCESSFUL!</SmallTitle>
        <Button
          onClick={() =>
            buy({
              tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
              amountETH: 0.01,
              provider: wallet.ethereum as providers.JsonRpcProvider,
            })
          }
        >
          Buyings
        </Button>
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
          padding: 1.1rem 1.2rem;
          justify-content: space-between;
        }
      `}</style>
    </Column>
  )
}

type Props = {
  open: boolean
  onRequestClose: () => void
}

const TradeModal = ({ open, onRequestClose }: Props): JSX.Element => {
  return (
    <Modal open={open} onRequestClose={onRequestClose}>
      <ModalContent />
    </Modal>
  )
}

export default TradeModal
