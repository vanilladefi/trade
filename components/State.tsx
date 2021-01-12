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

type AppState = {
  modalOpen: boolean
  walletType: keyof Connectors
}

export const loadState = (): AppState => {
  try {
    const serializedState = sessionStorage.getItem('appState')
    if (serializedState === null) {
      return initialState
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return initialState
  }
}

export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state)
    sessionStorage.setItem('appState', serializedState)
  } catch {
    console.error('Could not persist app state')
  }
}

const initialState = {
  modalOpen: false,
  walletType: 'provided' as keyof Connectors,
}

function stateReducer(prevState: AppState, action: AppAction): AppState {
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

const AppStateContext = React.createContext(initialState)
const AppDispatchContext = React.createContext<Dispatch<AppAction>>(() => null)

function useAppState(): [AppState, React.Dispatch<AppAction>] {
  const state = React.useContext(AppStateContext)
  const dispatch = React.useContext(AppDispatchContext)
  return [state, dispatch]
}

type ProviderProps = {
  children?: ReactNode
}

const AppStateProvider = ({ children }: ProviderProps): JSX.Element => {
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
    <AppDispatchContext.Provider value={dispatch}>
      <AppStateContext.Provider value={state}>
        {children}
      </AppStateContext.Provider>
    </AppDispatchContext.Provider>
  )
}

export { AppStateProvider, useAppState, AppActions }
