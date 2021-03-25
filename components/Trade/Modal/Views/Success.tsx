import { Column } from 'components/grid/Flex'
import TradeFlower from 'components/TradeFlower'
import { SmallTitle } from 'components/typography/Titles'
import useTransaction from 'hooks/useTransaction'

type Props = {
  id: string
}

const SuccessView = ({ id }: Props): JSX.Element => {
  const transaction = useTransaction(id)
  console.log(transaction)
  return (
    <Column>
      <div>
        <SmallTitle>TRADE SUCCESSFUL!</SmallTitle>
      </div>
      {transaction && (
        <TradeFlower
          received={{
            ticker: 'UNI',
            amount: transaction.amount ?? '0.0',
          }}
          paid={{ ticker: 'ETH', amount: '0.0056572' }}
          tradeURL={{
            domain: 'vnl.com',
            transactionHash: transaction.hash,
          }}
        />
      )}
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

export default SuccessView
