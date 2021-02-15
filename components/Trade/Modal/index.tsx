import Modal from 'components/Modal'
import { useState } from 'react'
import { PairByIdQueryResponse } from 'types/trade'
import { Prepare, Success } from './Views'

type Props = {
  open: boolean
  selectedPair: PairByIdQueryResponse | null
  onRequestClose: () => void
}

export enum View {
  Prepare,
  Success,
}

export enum Operation {
  Buy = 'buy',
  Sell = 'sell',
}

const TradeModal = ({
  open,
  onRequestClose,
  selectedPair,
}: Props): JSX.Element => {
  const [currentView] = useState<View>(View.Prepare)
  const [operation, setOperation] = useState<Operation>(Operation.Buy)
  return (
    <Modal open={open} onRequestClose={onRequestClose}>
      {currentView === View.Prepare && (
        <Prepare
          selectedPair={selectedPair}
          operation={operation}
          setOperation={setOperation}
          //setCurrentView={setCurrentView}
        />
      )}
      {currentView === View.Success && <Success selectedPair={selectedPair} />}
    </Modal>
  )
}

export default TradeModal
