import { providers } from 'ethers'
import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import type { Connectors } from 'use-wallet'
import { defaultProvider } from 'utils/config'

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

export const signerState = atom<providers.JsonRpcSigner | null>({
  key: 'signerState',
  default: null,
  dangerouslyAllowMutability: true, // If it works without, that'd be awesome. Here for now.
})

export const providerState = atom<
  providers.JsonRpcProvider | providers.AlchemyWebSocketProvider | null
>({
  key: 'providerState',
  default: defaultProvider,
  dangerouslyAllowMutability: true, // If it works without, that'd be awesome. Here for now.
})
