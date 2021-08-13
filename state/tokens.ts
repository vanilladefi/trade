import { atom } from 'recoil'
import type { Token } from 'types/trade'

export const userV2TokensState = atom<Token[] | null>({
  key: 'userV2TokensState',
  default: null,
  dangerouslyAllowMutability: true,
})

export const userV3TokensState = atom<Token[] | null>({
  key: 'userV3TokensState',
  default: null,
  dangerouslyAllowMutability: true,
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
