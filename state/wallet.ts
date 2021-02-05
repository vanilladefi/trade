import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import type { Connectors } from 'use-wallet'

const { persistAtom } =
  typeof window !== 'undefined'
    ? recoilPersist({ key: 'vanilla-walletstate' })
    : {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        persistAtom: () => {},
      }

export const walletModalOpenState = atom<boolean>({
  key: 'walletModalOpenState',
  default: false,
})

export const storedWalletConnectorState = atom<keyof Connectors | null>({
  key: 'storedWalletConnectorState',
  default: null,
  effects_UNSTABLE: [persistAtom],
})
