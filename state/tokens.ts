import { atom } from 'recoil'
import type { Token } from 'types/trade'

export const userTokensState = atom<Token[] | null>({
  key: 'userTokensState',
  default: null,
})

export const hodlModeState = atom<boolean>({
  key: 'hodlModeState',
  default: false,
})

export const allTokensStoreState = atom<Token[]>({
  key: 'allTokensStoreState',
  default: [],
  dangerouslyAllowMutability: true,
})
