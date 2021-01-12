import React, { Dispatch, ReactNode } from 'react'
import { Connectors, useWallet } from 'use-wallet'

enum AppActions {
  OPEN_MODAL,
  CLOSE_MODAL,
  SAVE_WALLET_TYPE,
  RESET_WALLET_TYPE,
}

type AppAction = {
  type: AppActions
  payload?: string | keyof Connectors
}

type WalletState = {
  modalOpen: boolean
  walletType: keyof Connectors
}

export const loadState = (): WalletState => {
  try {
    const serializedState = sessionStorage.getItem(' WalletState')
    if (serializedState === null) {
      return initialState
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return initialState
  }
}

export const saveState = (state: WalletState): void => {
  try {
    const serializedState = JSON.stringify(state)
    sessionStorage.setItem(' WalletState', serializedState)
  } catch {
    console.error('Could not persist app state')
  }
}

const initialState = {
  modalOpen: false,
  walletType: 'provided' as keyof Connectors,
}

function stateReducer(prevState: WalletState, action: AppAction): WalletState {
  switch (action.type) {
    case AppActions.OPEN_MODAL: {
      return { ...prevState, modalOpen: true }
    }
    case AppActions.CLOSE_MODAL: {
      return { ...prevState, modalOpen: false }
    }
    case AppActions.SAVE_WALLET_TYPE: {
      if (action.payload as keyof Connectors) {
        return { ...prevState, walletType: action.payload as keyof Connectors }
      }
      return prevState
    }
    case AppActions.RESET_WALLET_TYPE: {
      return { ...prevState, walletType: initialState.walletType }
    }
    default: {
      return prevState
    }
  }
}

const WalletStateContext = React.createContext(initialState)
const WalletDispatchContext = React.createContext<Dispatch<AppAction>>(
  () => null
)

function useWalletState(): [WalletState, React.Dispatch<AppAction>] {
  const state = React.useContext(WalletStateContext)
  const dispatch = React.useContext(WalletDispatchContext)
  return [state, dispatch]
}

type ProviderProps = {
  children?: ReactNode
}

const WalletStateProvider = ({ children }: ProviderProps): JSX.Element => {
  const wallet = useWallet()

  const previousState = loadState()
  const [state, dispatch] = React.useReducer(stateReducer, previousState)

  React.useEffect(() => {
    if (
      previousState.walletType !== initialState.walletType &&
      previousState.walletType !== null
    ) {
      if (wallet.connector !== 'provided' && wallet.status !== 'connected') {
        wallet.connect(previousState.walletType)
      }
    }
    saveState(state)
  }, [state])

  return (
    <WalletDispatchContext.Provider value={dispatch}>
      <WalletStateContext.Provider value={state}>
        {children}
      </WalletStateContext.Provider>
    </WalletDispatchContext.Provider>
  )
}

export { WalletStateProvider, useWalletState, AppActions }
