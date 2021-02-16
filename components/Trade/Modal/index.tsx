import Modal from 'components/Modal'
import { tokenListChainId } from 'lib/tokens'
import { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { token0State, token1State } from 'state/trade'
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

  const setToken0 = useSetRecoilState(token0State)
  const setToken1 = useSetRecoilState(token1State)

  useEffect(() => {
    if (selectedPair) {
      const token0 = {
        symbol: selectedPair.token0.symbol,
        address: selectedPair.token0.id,
        decimals: parseInt(selectedPair.token0.decimals),
        pairId: selectedPair.id,
        chainId: tokenListChainId,
      }
      const token1 = {
        symbol: selectedPair.token1.symbol,
        address: selectedPair.token1.id,
        decimals: parseInt(selectedPair.token1.decimals),
        pairId: selectedPair.id,
        chainId: tokenListChainId,
      }
      if (token0.symbol === 'WETH') {
        setToken0(token1)
        setToken1(token0)
      } else {
        setToken0(token0)
        setToken1(token1)
      }
    }
  }, [selectedPair, setToken0, setToken1])

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
