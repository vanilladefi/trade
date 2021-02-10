import { Column } from 'components/grid/Flex'
import Button from 'components/input/Button'
import Modal from 'components/Modal'
import TradeFlower from 'components/TradeFlower'
import { SmallTitle } from 'components/typography/Titles'
import { buy } from 'lib/trade'
import { useRecoilValue } from 'recoil'
import { signerState } from 'state/wallet'

const ModalContent = (): JSX.Element => {
  const signer = useRecoilValue(signerState)
  return (
    <Column>
      <div>
        <SmallTitle>TRADE SUCCESSFUL!</SmallTitle>
        {signer && (
          <Button
            onClick={() =>
              buy({
                tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                amountETH: 12390421,
                signer: signer,
              })
            }
          >
            Buyings
          </Button>
        )}
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
