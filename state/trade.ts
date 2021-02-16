import { weth } from 'lib/tokens'
import { atom } from 'recoil'
import type { UniSwapToken } from 'types/trade'

export const token0State = atom<UniSwapToken | null>({
  key: 'token0State',
  default: null,
})

export const token1State = atom<UniSwapToken>({
  key: 'token1State',
  default: weth,
})
