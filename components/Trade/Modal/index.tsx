import { Width } from 'components/grid/Flex'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { Suspense, useCallback } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { selectedOperation, selectedPairIdState } from 'state/trade'
import { PrerenderProps } from 'types/content'
import { UniswapVersion, VanillaVersion } from 'types/general'

const Modal = dynamic(import('components/Modal'))
const Column = dynamic(import('components/grid/Flex').then((mod) => mod.Column))
const Row = dynamic(import('components/grid/Flex').then((mod) => mod.Row))
const Dots = dynamic(import('components/Spinner').then((mod) => mod.Dots))
const PrepareV2 = dynamic(import('components/Trade/Modal/Views/v2/Prepare'))
const PrepareV3 = dynamic(import('components/Trade/Modal/Views/v3/Prepare'))

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

const Success = dynamic(() => import('./Views/Success'))

type Props = PrerenderProps & {
  open: boolean
  onRequestClose: () => void
  uniswapVersion: UniswapVersion
}

const TradeModal: React.FC<Props> = ({
  open,
  onRequestClose,
  uniswapVersion,
  ...rest
}: Props) => {
  const [operation, setOperation] = useRecoilState(selectedOperation)
  const setSelectedPairId = useSetRecoilState(selectedPairIdState)

  const router = useRouter()
  const parsedId = useCallback(() => {
    const { id } = router.query
    return id && id.length ? id.toString() : (id as string)
  }, [router.query])

  const onClose = () => {
    setSelectedPairId(null)
    onRequestClose()
  }

  return (
    <Modal open={open || !!parsedId()} onRequestClose={onClose}>
      <Suspense fallback={<Loading />}>
        {uniswapVersion === UniswapVersion.v2 &&
          (!parsedId() ? (
            <PrepareV2
              operation={operation}
              setOperation={setOperation}
              {...rest}
            />
          ) : (
            <Success
              id={parsedId()}
              closeModal={onClose}
              version={VanillaVersion.V1_0}
            />
          ))}
        {uniswapVersion === UniswapVersion.v3 &&
          (!parsedId() ? (
            <PrepareV3
              operation={operation}
              setOperation={setOperation}
              {...rest}
            />
          ) : (
            <Success
              id={parsedId()}
              closeModal={onClose}
              version={VanillaVersion.V1_1}
            />
          ))}
      </Suspense>
    </Modal>
  )
}

export default TradeModal
