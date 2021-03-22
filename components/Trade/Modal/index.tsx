import { Column, Row, Width } from 'components/grid/Flex'
import Modal from 'components/Modal'
import { Spinner } from 'components/Spinner'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { Suspense, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { selectedOperation, selectedPairIdState } from 'state/trade'

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

const TradeModal = ({ open, onRequestClose }: Props): JSX.Element => {
  const [operation, setOperation] = useRecoilState(selectedOperation)
  const [modalCloseEnabled, setModalCloseEnabled] = useState<boolean>(true)
  const setSelectedPairId = useSetRecoilState(selectedPairIdState)

  const router = useRouter()
  const { id } = router.query
  const parsedId: string = id && id.length ? id.toString() : (id as string)

  const onClose = () => {
    if (modalCloseEnabled) {
      setSelectedPairId(null)
      onRequestClose()
      router.push('/trade', undefined, { shallow: true }) // Shallow to disable fetching getInitialProps() again
    }
  }

  return (
    <Modal open={open || !!id} onRequestClose={onClose}>
      <Suspense fallback={<Loading />}>
        {!id ? (
          <Prepare
            operation={operation}
            setOperation={setOperation}
            setModalCloseEnabled={setModalCloseEnabled}
          />
        ) : (
          <Success id={parsedId} closeModal={onClose} />
        )}
      </Suspense>
    </Modal>
  )
}

export default TradeModal
