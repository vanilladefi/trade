import WalletConnectProvider from '@walletconnect/web3-provider'
import { ethers, providers } from 'ethers'
import React, { Dispatch, ReactNode } from 'react'

declare global {
  interface Window {
    web3: providers.ExternalProvider
    ethereum: providers.ExternalProvider
  }
}

enum ProviderTypes {
  DEFAULT,
  INJECTED,
  WALLETCONNECT,
}

enum WalletActions {
  CONNECT_WALLET,
  DISCONNECT_WALLET,
  OPEN_MODAL,
  CLOSE_MODAL,
}

type WalletAction = {
  type: WalletActions
  payload: string | ProviderTypes
}

type WalletState = {
  modalOpen: boolean
  ethers: providers.Provider
}

const getWeb3Provider = (
  web3: providers.ExternalProvider | providers.JsonRpcFetchFunc
) => {
  return new providers.Web3Provider(web3)
}

const ethersWithProvider = (
  providerType?: ProviderTypes
): providers.Provider => {
  try {
    switch (providerType) {
      case ProviderTypes.INJECTED: {
        if (window.web3 || window.ethereum) {
          const injectedProvider = window.web3 || window.ethereum
          return getWeb3Provider(injectedProvider)
        }
        break
      }
      case ProviderTypes.WALLETCONNECT: {
        const walletConnect = new WalletConnectProvider({
          infuraId: '2b58be24601f4086baef24488838c239',
        })
        walletConnect.enable().then(() => {
          return getWeb3Provider(walletConnect)
        })
        break
      }
      default: {
        break
      }
    }
  } catch (e) {
    return ethers.getDefaultProvider()
  }
  return ethers.getDefaultProvider()
}

const initialState = {
  modalOpen: false,
  ethers: ethersWithProvider(),
}

function walletReducer(
  prevState: WalletState,
  action: WalletAction
): WalletState {
  switch (action.type) {
    case WalletActions.CONNECT_WALLET: {
      if (action.payload as ProviderTypes) {
        const payload: ProviderTypes = action.payload as ProviderTypes
        return Object.assign(prevState, { ethers: ethersWithProvider(payload) })
      }
      return prevState
    }
    case WalletActions.DISCONNECT_WALLET: {
      return Object.assign(prevState, { ethers: ethersWithProvider() })
    }
    case WalletActions.OPEN_MODAL: {
      return Object.assign(prevState, { modalOpen: true })
    }
    case WalletActions.CLOSE_MODAL: {
      return Object.assign(prevState, { modalOpen: false })
    }
  }
}

const WalletStateContext = React.createContext(initialState)
const WalletDispatchContext = React.createContext<Dispatch<WalletAction>>(
  () => null
)

type ProviderProps = {
  children?: ReactNode
}

const WalletProvider = ({ children }: ProviderProps): JSX.Element => {
  const [state, dispatch] = React.useReducer(walletReducer, initialState)
  return (
    <WalletStateContext.Provider value={state}>
      <WalletDispatchContext.Provider value={dispatch}>
        {children}
      </WalletDispatchContext.Provider>
    </WalletStateContext.Provider>
  )
}

export { ethersWithProvider, ProviderTypes, WalletProvider }
