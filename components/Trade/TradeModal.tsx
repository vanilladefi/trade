import { Fetcher, Price, Route, Token, WETH } from '@uniswap/sdk'
import { Column } from 'components/grid/Flex'
import Button from 'components/input/Button'
import Modal from 'components/Modal'
import TradeFlower from 'components/TradeFlower'
import { SmallTitle } from 'components/typography/Titles'
import { providers } from 'ethers'
import { tokenListChainId } from 'lib/tokens'
import { buy } from 'lib/trade'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState, signerState } from 'state/wallet'
import { PairByIdQueryResponse } from 'types/trade'

type WETHChainOptions = {
  1: Token
  3: Token
  4: Token
  5: Token
  42: Token
}

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
    const pair = await Fetcher.fetchPairData(
      tokenA,
      WETH[tokenListChainId as keyof WETHChainOptions],
      provider,
    )
    const route = new Route(
      [pair],
      WETH[tokenListChainId as keyof WETHChainOptions],
    )
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
  }, [selectedPair, provider])

  return (
    <Column>
      <div>
        <SmallTitle>TRADE SUCCESSFUL!</SmallTitle>
        {signer && selectedPair && (
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
        )}
      </div>
      <TradeFlower
        received={{ ticker: 'DAI', amount: 2.5 }}
        paid={{ ticker: 'ETH', amount: 0.0056572 }}
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
}: Props): JSX.Element => {
  return (
    <Modal open={open} onRequestClose={onRequestClose}>
      <ModalContent
        selectedPair={selectedPair}
        selectedPairId={selectedPairId}
      />
    </Modal>
  )
}

export default TradeModal
