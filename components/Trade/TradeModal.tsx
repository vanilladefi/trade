import { Fetcher, Price, Route, Token } from '@uniswap/sdk'
import { Column } from 'components/grid/Flex'
import Button from 'components/input/Button'
import Modal from 'components/Modal'
import TradeFlower from 'components/TradeFlower'
import { SmallTitle } from 'components/typography/Titles'
import { providers } from 'ethers'
import { tokenListChainId } from 'lib/tokens'
import { buy } from 'lib/trade'
import debounce from 'lodash.debounce'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState, signerState } from 'state/wallet'
import { PairByIdQueryResponse } from 'types/trade'

async function getMidPrice(
  selectedPair: PairByIdQueryResponse,
  provider: providers.JsonRpcProvider,
): Promise<Price> {
  try {
    const tokenA = new Token(
      tokenListChainId,
      selectedPair.token0.id,
      parseInt(selectedPair.token0.decimals),
    )
    const tokenB = new Token(
      tokenListChainId,
      selectedPair.token1.id,
      parseInt(selectedPair.token1.decimals),
    )
    const pair = await Fetcher.fetchPairData(tokenA, tokenB, provider)
    const route = new Route([pair], tokenB)
    return route.midPrice
  } catch (error) {
    return error
  }
}

type ContentProps = {
  selectedPair: PairByIdQueryResponse | null
  selectedPairId: string
}

const ModalContent = ({
  selectedPair,
  selectedPairId,
}: ContentProps): JSX.Element => {
  const signer = useRecoilValue(signerState)
  const provider = useRecoilValue(providerState)
  const [midPrice, setMidPrice] = useState<Price>()
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    selectedPair &&
      provider &&
      getMidPrice(selectedPair, provider).then((price) => setMidPrice(price))
    console.log(
      midPrice,
      midPrice && parseFloat(midPrice?.toSignificant()),
      amount,
    )
  }, [selectedPair, provider, amount])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleAmountChanged = useCallback(
    debounce((value: string) => {
      setAmount(parseFloat(value))
    }, 200),
    [setAmount],
  )

  const token1Out = useCallback(
    () => (midPrice ? amount * parseFloat(midPrice?.toSignificant()) : 0),
    [amount, midPrice],
  )

  return (
    <Column>
      <div>
        <SmallTitle>TRADE SUCCESSFUL!</SmallTitle>
        {signer && selectedPair && (
          <>
            <Button
              onClick={() =>
                buy({
                  tokenAddress: selectedPair.token1.id,
                  amountETH: amount,
                  signer: signer,
                })
              }
            >
              Buyings for price{' '}
              {midPrice?.toSignificant && midPrice?.toSignificant()}
            </Button>
            <input
              type='number'
              onInput={(e) => handleAmountChanged(e.currentTarget.value)}
            />
          </>
        )}
      </div>
      <TradeFlower
        received={{
          ticker: selectedPair?.token1.symbol || '',
          amount: token1Out(),
        }}
        paid={{
          ticker:
            (selectedPair?.token0.symbol === 'WETH'
              ? 'ETH'
              : selectedPair?.token0.symbol) || '',
          amount: amount,
        }}
        tradeURL={{
          domain: 'vnl.com',
          transactionHash:
            '0x05c7cedb4b6a234a92fcc9e396661cbed6d89e301899af6569dae3ff32a48acb',
        }}
      />
      <div>
        <Column>
          <SmallTitle>Share for more VNL</SmallTitle>
          <span>Learn more</span>
        </Column>
        <span>links here</span>
      </div>
      <style jsx>{`
        div {
          display: flex;
          flex-direction: row;
          padding: 1.1rem 1.2rem;
          justify-content: space-between;
        }
      `}</style>
    </Column>
  )
}

type Props = {
  open: boolean
  selectedPair: PairByIdQueryResponse | null
  selectedPairId: string
  onRequestClose: () => void
}

const TradeModal = ({
  open,
  onRequestClose,
  selectedPair,
  selectedPairId,
}: Props): JSX.Element => (
  <Modal open={open} onRequestClose={onRequestClose}>
    <ModalContent selectedPair={selectedPair} selectedPairId={selectedPairId} />
  </Modal>
)

export default TradeModal
