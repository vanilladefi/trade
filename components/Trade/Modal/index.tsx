import Modal from 'components/Modal'
import dynamic from 'next/dynamic'
import React, { Suspense, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { selectedPairIdState } from 'state/trade'

const Loading = (): JSX.Element => <div>Loading pair data...</div>

const Prepare = dynamic(() => import('./Views/Prepare'), {
  loading: () => <Loading />,
  ssr: false,
})

const Success = dynamic(() => import('./Views/Success'), {
  loading: () => <Loading />,
  ssr: false,
})

type Props = {
  open: boolean
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

const TradeModal = ({ open, onRequestClose }: Props): JSX.Element => {
  const [currentView] = useState<View>(View.Prepare)
  const [operation, setOperation] = useState<Operation>(Operation.Buy)
  const setSelectedPairId = useSetRecoilState(selectedPairIdState)

  return (
    <Suspense fallback={() => <Loading />}>
      <Modal
        open={open}
        onRequestClose={() => {
          setSelectedPairId(null)
          onRequestClose()
        }}
      >
        {currentView === View.Prepare && (
          <Prepare
            operation={operation}
            setOperation={setOperation}
            //setCurrentView={setCurrentView}
          />
        )}
        {currentView === View.Success && <Success />}
      </Modal>
    </Suspense>
  )
}

export default TradeModal
