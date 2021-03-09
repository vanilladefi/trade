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
      const pairId = get(selectedPairIdState)
      const counterAsset = get(selectedCounterAsset)
      if (pairId !== null) {
        const response = await thegraphClient.request(PairByIdQuery, {
          pairId: pairId,
        })

        if (response?.pairs?.[0]) {
          const id = response.pairs[0].id
          let token0, token1

          if (response.pairs[0].token0?.id == counterAsset.address) {
            token0 = response.pairs[0].token1
            token1 = response.pairs[0].token0
          } else {
            token0 = response.pairs[0].token0
            token1 = response.pairs[0].token1
          }

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

export const token0Selector = selector<UniSwapToken | null>({
  key: 'token0Selector',
  get: ({ get }) => {
    const pairResponse = get(selectedPairState)
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
  get: ({ get }) => {
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
