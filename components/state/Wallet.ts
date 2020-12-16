import WalletConnectProvider from '@walletconnect/web3-provider'
import ethers, { providers } from 'ethers'
import React, { ReactNode } from 'react'

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
  ethers: ethersWithProvider()
}

const walletReducer = (state: Object, action: Object): Object => {
  switch (action.type) {
    case  
  }
}

const WalletContext = React.createContext(initialState)

type ProviderProps = {
  children?: ReactNode
}

const WalletProvider = ({ children }: ProviderProps): JSX.Element => {
  const [state, dispatch] = React.useReducer(walletReducer, initialState)
  return <WalletContext.Provider value={state}>{children}</WalletContext.Provider>
}

export { WalletContext, ethersWithProvider, ProviderTypes }
