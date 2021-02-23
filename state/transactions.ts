import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import { TransactionDetails } from 'types/trade'

const { persistAtom } =
  typeof window !== 'undefined'
    ? recoilPersist({ key: 'vanilla-transactions' })
    : {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        persistAtom: () => {},
      }

export const transactionsState = atom<Record<string, TransactionDetails>>({
  key: 'transactionsState',
  default: {},
  effects_UNSTABLE: [persistAtom],
})
