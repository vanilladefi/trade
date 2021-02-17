import Modal from 'components/Modal'
import dynamic from 'next/dynamic'
import React, { ReactElement, useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { selectedPairIdState } from 'state/trade'

const Loading = (): ReactElement => <div>Loading pair data...</div>

const Prepare = dynamic(() => import('./Views/Prepare'), {
  loading: () => <Loading />,
})

const Success = dynamic(() => import('./Views/Success'), {
  loading: () => <Loading />,
})

type Props = {
  open: boolean
  selectedPairId?: string
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
  selectedPairId,
}: Props): JSX.Element => {
  const [currentView] = useState<View>(View.Prepare)
  const [operation, setOperation] = useState<Operation>(Operation.Buy)

  const setSelectedPairId = useSetRecoilState(selectedPairIdState)

  // Retrieve pair info from The Graph when 'selectedPairId' changes
  useEffect(() => {
    setSelectedPairId(selectedPairId ?? null)
  }, [selectedPairId, setSelectedPairId])

  return (
    <Modal open={open} onRequestClose={onRequestClose}>
      {currentView === View.Prepare && (
        <Prepare
          operation={operation}
          setOperation={setOperation}
          //setCurrentView={setCurrentView}
        />
      )}
      {currentView === View.Success && <Success />}
    </Modal>
  )
}

export default TradeModal
