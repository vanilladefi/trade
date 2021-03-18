import { atom } from 'recoil'
import type { Token } from 'types/trade'

export const userTokensState = atom<Token[]>({
  key: 'userTokensState',
  default: [],
})

export const allTokensStoreState = atom<Token[]>({
  key: 'allTokensStoreState',
  default: [],
})
