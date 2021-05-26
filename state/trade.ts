import { Percent } from '@uniswap/sdk-core'
import { UniswapVersion } from 'lib/graphql'
import { weth } from 'lib/tokens'
import { atom, selector } from 'recoil'
import { Operation, PairByIdQueryResponse, Token } from 'types/trade'
import { uniswapV2TokenState, uniswapV3TokenState } from './tokens'

export const selectedPairIdState = atom<string | null>({
  key: 'selectedPairId',
  default: null,
})

export const selectedOperation = atom<Operation>({
  key: 'selectedOperation',
  default: Operation.Buy,
})

export const selectedExchange = atom<UniswapVersion>({
  key: 'selectedExchange',
  default: UniswapVersion.v3,
})

export const selectedCounterAsset = atom<Token>({
  key: 'selectedCounterAsset',
  default: weth,
})

export const selectedSlippageTolerance = atom<Percent>({
  key: 'selectedSlippageTolerance',
  default: new Percent('5', '1000'),
})

export const selectedPairState = selector<PairByIdQueryResponse | null>({
  key: 'selectedPair',
  get: async ({ get }) => {
    let pair: PairByIdQueryResponse | null = null
    try {
      const exchange = get(selectedExchange)
      const tokens = get(
        exchange === UniswapVersion.v3
          ? uniswapV3TokenState
          : uniswapV2TokenState,
      )
      const pairId = get(selectedPairIdState)
      const counterAsset = get(selectedCounterAsset)
      if (pairId !== null) {
        const tokenMatch = tokens.find((token) => token.pairId === pairId)
        if (tokenMatch) {
          const id = pairId
          const token0 = tokenMatch
          const token1 = counterAsset
          pair =
            {
              id: id,
              token0: token0,
              token1: token1,
            } || null
        } else {
          pair = null
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      return pair
    }
  },
})

export const token0Selector = selector<Token | null>({
  key: 'token0Selector',
  get: ({ get }) => {
    const pairResponse = get(selectedPairState)
    console.log('token0 data updated')
    return pairResponse?.token0 ?? null
  },
})

export const token1Selector = selector<Token | null>({
  key: 'token1Selector',
  get: ({ get }) => {
    const pairResponse = get(selectedPairState)
    console.log('token1 data updated')
    return pairResponse?.token1 ?? null
  },
})
