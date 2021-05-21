import { atom } from 'recoil'
import type { Token } from 'types/trade'

export const userTokensState = atom<Token[] | null>({
  key: 'userTokensState',
  default: null,
})

export const uniswapV2TokenState = atom<Token[]>({
  key: 'uniswapV2TokenState',
  default: [],
  dangerouslyAllowMutability: true,
})

export const uniswapV3TokenState = atom<Token[]>({
  key: 'uniswapV3TokenState',
  default: [],
  dangerouslyAllowMutability: true,
})
