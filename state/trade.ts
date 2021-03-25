import { PairByIdQuery, thegraphClient } from 'lib/graphql'
import { getLogoUri, tokenListChainId, weth } from 'lib/tokens'
import { atom, selector } from 'recoil'
import type { UniSwapToken } from 'types/trade'
import { PairByIdQueryResponse } from 'types/trade'

export const selectedPairIdState = atom<string | null>({
  key: 'selectedPairId',
  default: null,
})

export const selectedCounterAsset = atom<UniSwapToken>({
  key: 'selectedCounterAsset',
  default: weth,
})

export const selectedPairState = selector<PairByIdQueryResponse | null>({
  key: 'selectedPair',
  get: async ({ get }) => {
    let pair: PairByIdQueryResponse | null = null
    try {
      const response = await thegraphClient.request(PairByIdQuery, {
        pairId: selectedPairIdState,
      })
      pair = response?.pairs?.[0] || null

      const counterAsset = get(selectedCounterAsset)

      // Sort pairs so that the counter asset is always token1
      if (pair?.token0?.id === counterAsset.address) {
        pair.token0 = pair.token1
        pair.token1 = {
          id: counterAsset.address,
          symbol: counterAsset.symbol ?? '',
          decimals: String(counterAsset.decimals),
        }
      }

      console.log(pair)
    } catch (e) {
      console.error(e)
    } finally {
      return pair
    }
  },
})

export const token0Selector = selector<UniSwapToken | null>({
  key: 'token0Selector',
  get: async ({ get }) => {
    const pairResponse = get(selectedPairState)
    console.log(pairResponse)
    return pairResponse
      ? {
          symbol: pairResponse.token0.symbol,
          address: pairResponse.token0.id,
          decimals: parseInt(pairResponse.token0.decimals),
          pairId: pairResponse.id,
          chainId: tokenListChainId,
          logoURI: getLogoUri(pairResponse.token0.id),
        }
      : null
  },
})

export const token1Selector = selector<UniSwapToken | null>({
  key: 'token1Selector',
  get: async ({ get }) => {
    const pairResponse = get(selectedPairState)
    return pairResponse
      ? {
          symbol: pairResponse.token1.symbol,
          address: pairResponse.token1.id,
          decimals: parseInt(pairResponse.token1.decimals),
          pairId: pairResponse.id,
          chainId: tokenListChainId,
          logoURI: getLogoUri(pairResponse.token1.id),
        }
      : null
  },
})
