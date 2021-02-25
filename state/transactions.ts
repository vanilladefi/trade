import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import { ChainIdToTransactionMapping } from 'types/general'

const defaultTransactionsState = {
  '1': {},
  '2': {},
  '3': {},
  '4': {},
  '42': {},
  '1337': {},
}

const { persistAtom } =
  typeof window !== 'undefined'
    ? recoilPersist({ key: 'vanilla-transactions' })
    : {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        persistAtom: () => {},
      }

export const transactionsState = atom<ChainIdToTransactionMapping>({
  key: 'transactionsState',
  default: defaultTransactionsState,
  effects_UNSTABLE: [persistAtom],
})
