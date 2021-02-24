import { Column, Row, Width } from 'components/grid/Flex'
import Modal from 'components/Modal'
import Spinner from 'components/Spinner'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { Suspense, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { selectedPairIdState } from 'state/trade'

const Loading = (): JSX.Element => (
  <Row>
    <Column width={Width.TWELVE}>
      <div>
        <Spinner />
      </div>
      <style jsx>{`
        div {
          width: 100%;
          height: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </Column>
  </Row>
)

const Prepare = dynamic(() => import('./Views/Prepare'), {
  ssr: false,
})

const Success = dynamic(() => import('./Views/Success'), {
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

  const router = useRouter()
  const { id } = router.query

  return (
    <Modal
      open={open || !!id}
      onRequestClose={() => {
        setSelectedPairId(null)
        onRequestClose()
      }}
    >
      <Suspense fallback={<Loading />}>
        {currentView === View.Prepare && !id && (
          <Prepare
            operation={operation}
            setOperation={setOperation}
            //setCurrentView={setCurrentView}
          />
        )}
        {currentView === View.Success || (id && id !== '' && <Success />)}
      </Suspense>
    </Modal>
  )
}

export default TradeModal
