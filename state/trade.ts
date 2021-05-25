import { Percent } from '@uniswap/sdk-core'
import { weth } from 'lib/tokens'
import { atom, selector } from 'recoil'
import { Operation, PairByIdQueryResponse, Token } from 'types/trade'
import { uniswapV3TokenState } from './tokens'

export const selectedPairIdState = atom<string | null>({
  key: 'selectedPairId',
  default: null,
})

export const selectedOperation = atom<Operation>({
  key: 'selectedOperation',
  default: Operation.Buy,
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
      const tokens = get(uniswapV3TokenState)
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
    return pairResponse ? pairResponse.token0 : null
  },
})

export const token1Selector = selector<Token | null>({
  key: 'token1Selector',
  get: ({ get }) => {
    const pairResponse = get(selectedPairState)
    return pairResponse ? pairResponse.token1 : null
  },
})
