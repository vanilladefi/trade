import { Column } from 'components/grid/Flex'
import TradeFlower from 'components/TradeFlower'
import { SmallTitle } from 'components/typography/Titles'
import { PairByIdQueryResponse } from 'types/trade'

type ContentProps = {
  selectedPair: PairByIdQueryResponse | null
}

const ModalContent = ({ selectedPair }: ContentProps): JSX.Element => {
  return (
    <Column>
      <div>
        <SmallTitle>TRADE SUCCESSFUL!</SmallTitle>
      </div>
      <TradeFlower
        received={{
          ticker: selectedPair?.token1.symbol || '',
          amount: '1',
        }}
        paid={{
          ticker:
            (selectedPair?.token0.symbol === 'WETH'
              ? 'ETH'
              : selectedPair?.token0.symbol) || '',
          amount: '0',
        }}
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

export default ModalContent
