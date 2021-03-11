import { Column } from 'components/grid/Flex'
import Button, { ButtonSize } from 'components/input/Button'
import TradeFlower from 'components/TradeFlower'
import { SmallTitle } from 'components/typography/Titles'
import { formatUnits } from 'ethers/lib/utils'
import useTransaction from 'hooks/useTransaction'

type Props = {
  id: string
  closeModal: () => void
}

const SuccessView = ({ id, closeModal }: Props): JSX.Element => {
  const transaction = useTransaction(id)

  const [amountPaid, amountReceived] = [
    transaction
      ? parseFloat(
          formatUnits(
            transaction.amountPaid || '0',
            transaction.paid?.decimals,
          ),
        )
      : 0,
    transaction
      ? parseFloat(
          formatUnits(
            transaction.amountReceived || '0',
            transaction.paid?.decimals,
          ),
        )
      : 0,
  ]

  return (
    <Column>
      <div>
        <SmallTitle>TRADE SUCCESSFUL!</SmallTitle>
      </div>
      {transaction && (
        <TradeFlower
          received={{
            symbol: transaction.received?.symbol ?? '',
            amount: amountReceived,
          }}
          paid={{
            symbol: transaction.paid?.symbol ?? '',
            amount: amountPaid,
          }}
          tradeURL={{
            domain: 'vnl.com',
            transactionHash: transaction.hash,
          }}
        />
      )}
      <Button size={ButtonSize.LARGE} onClick={() => closeModal()}>
        Close
      </Button>
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
