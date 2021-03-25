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
            transaction.received?.decimals,
          ),
        )
      : 0,
  ]

  const reward = formatUnits(transaction?.reward?.toString() || '0', 12)

  return (
    <Column>
      <div className='row noBottomMargin'>
        <SmallTitle>TRADE SUCCESSFUL!</SmallTitle>
      </div>
      {transaction && (
        <div className='row noBottomMargin'>
          <TradeFlower
            received={{
              symbol: transaction.received?.symbol ?? '',
              amount: amountReceived,
            }}
            paid={{
              symbol: transaction.paid?.symbol ?? '',
              amount: amountPaid,
            }}
            reward={{
              symbol: 'VNL',
              amount: reward ? parseFloat(reward) : 0.0,
            }}
            tradeURL={{
              domain: 'vnl.com',
              transactionHash: transaction.hash,
            }}
          />
        </div>
      )}
      <div className='row'>
        <Button
          size={ButtonSize.LARGE}
          onClick={() => closeModal()}
          width='100%;'
        >
          Close
        </Button>
      </div>
      <style jsx>{`
        div {
          display: flex;
          flex-direction: row;
          padding: 1.1rem 1.2rem;
          justify-content: space-between;
        }
        .noBottomMargin {
          padding-bottom: 0;
        }
        .row {
          position: relative;
          width: 100%;
          flex-direction: row;
        }
        .row button {
          display: flex;
        }
      `}</style>
    </Column>
  )
}

export default SuccessView
