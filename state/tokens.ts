import { atom, DefaultValue, selector } from 'recoil'
import type { Token } from 'types/trade'

export const userTokenSymbolsState = atom<string[]>({
  key: 'userTokenSymbolsState',
  default: ['UNI', 'USDC', 'MKR'],
})

export const userTokensState = selector<Token[]>({
  key: 'userTokensState',
  get: ({ get }) => {
    const tokens = get(allTokensStoreState)
    const symbols = get(userTokenSymbolsState)
    return tokens.filter((t) => symbols.includes(t.symbol))
  },
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      set(userTokenSymbolsState, newValue)
    } else {
      const symbols = newValue.map((t) => t.symbol)
      set(userTokenSymbolsState, symbols)
    }
  },
})

export const allTokensStoreState = atom<Token[]>({
  key: 'allTokensStoreState',
  default: [],
})
