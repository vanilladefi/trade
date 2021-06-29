import { Column, Row, Width } from 'components/grid/Flex'
import Modal from 'components/Modal'
import { Spinner } from 'components/Spinner'
import { UniswapVersion } from 'lib/graphql'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { Suspense, useCallback, useState } from 'react'
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

const PrepareV2 = dynamic(() => import('./Views/v2/Prepare'))

const PrepareV3 = dynamic(() => import('./Views/v3/Prepare'))

const Success = dynamic(() => import('./Views/Success'))

type Props = {
  open: boolean
  onRequestClose: () => void
  uniswapVersion: UniswapVersion
}

const TradeModal = ({
  open,
  onRequestClose,
  uniswapVersion,
}: Props): JSX.Element => {
  const [operation, setOperation] = useRecoilState(selectedOperation)
  const [modalCloseEnabled, setModalCloseEnabled] = useState<boolean>(true)
  const setSelectedPairId = useSetRecoilState(selectedPairIdState)

  const router = useRouter()
  const parsedId = useCallback(() => {
    const { id } = router.query
    return id && id.length ? id.toString() : (id as string)
  }, [router.query])

  const onClose = () => {
    if (modalCloseEnabled) {
      setSelectedPairId(null)
      onRequestClose()
      router.push('/trade', undefined, { shallow: true }) // Shallow to disable fetching getInitialProps() again
    }
  }

  return (
    <Modal open={open || !!parsedId()} onRequestClose={onClose}>
      <Suspense fallback={<Loading />}>
        {uniswapVersion === UniswapVersion.v2 &&
          (!parsedId() ? (
            <PrepareV2
              operation={operation}
              setOperation={setOperation}
              setModalCloseEnabled={setModalCloseEnabled}
            />
          ) : (
            <Success id={parsedId()} closeModal={onClose} />
          ))}
        {uniswapVersion === UniswapVersion.v3 &&
          (!parsedId() ? (
            <PrepareV3
              operation={operation}
              setOperation={setOperation}
              setModalCloseEnabled={setModalCloseEnabled}
            />
          ) : (
            <Success id={parsedId()} closeModal={onClose} />
          ))}
      </Suspense>
    </Modal>
  )
}

export default TradeModal
