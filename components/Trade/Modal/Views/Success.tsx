import { Width } from 'components/grid/Flex'
import { ButtonSize } from 'components/input/Button'
import { formatUnits } from 'ethers/lib/utils'
import useTransaction from 'hooks/useTransaction'
import dynamic from 'next/dynamic'
import React, { Suspense, useCallback } from 'react'
import { VanillaVersion } from 'types/general'
import { vnlDecimals } from 'utils/config/vanilla'

const Dots = dynamic(import('components/Spinner').then((mod) => mod.Dots))
const Column = dynamic(import('components/grid/Flex').then((mod) => mod.Column))
const Row = dynamic(import('components/grid/Flex').then((mod) => mod.Row))
const Button = dynamic(import('components/input/Button'))
const TradeFlower = dynamic(import('components/TradeFlower'))
const SmallTitle = dynamic(
  import('components/typography/Titles').then((mod) => mod.SmallTitle),
)

type Props = {
  id: string
  closeModal: () => void
  version: VanillaVersion
}

const Loading: React.FC = () => (
  <Row>
    <Column width={Width.TWELVE}>
      <div>
        <Dots />
      </div>
      <style jsx>{`
        div {
          width: 30rem;
          height: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </Column>
  </Row>
)

const SuccessView: React.FC<Props> = ({ id, closeModal, version }: Props) => {
  const transaction = useTransaction(version, id)

  const amountPaid = useCallback(() => {
    return transaction
      ? parseFloat(
          formatUnits(
            transaction.amountPaid || '0',
            transaction.paid?.decimals,
          ),
        )
      : 0
  }, [transaction])

  const amountReceived = useCallback(() => {
    return transaction
      ? parseFloat(
          formatUnits(
            transaction.amountReceived || '0',
            transaction.received?.decimals,
          ),
        )
      : 0
  }, [transaction])

  const reward = useCallback(() => {
    return formatUnits(transaction?.reward?.toString() || '0', vnlDecimals)
  }, [transaction])

  return (
    <Column>
      <div className='row noBottomMargin'>
        <SmallTitle>
          TRADE {transaction ? 'SUCCESSFUL' : 'SUBMITTED'}!
        </SmallTitle>
      </div>
      {transaction ? (
        <div className='row noBottomMargin'>
          <Suspense fallback={<Loading />}>
            <TradeFlower
              received={{
                symbol: transaction.received?.symbol ?? '',
                amount: amountReceived(),
              }}
              paid={{
                symbol: transaction.paid?.symbol ?? '',
                amount: amountPaid(),
              }}
              reward={{
                symbol: 'VNL',
                amount: reward ? parseFloat(reward()) : 0.0,
              }}
              tradeURL={{
                domain: 'vanilladefi.com',
                transactionHash: transaction.hash,
              }}
            />
          </Suspense>
        </div>
      ) : (
        <Column>
          <div>
            <a
              href={`https://etherscan.io/tx/${id}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              Check out the transaction on etherscan
            </a>
          </div>
          <Loading />
        </Column>
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
