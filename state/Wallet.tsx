import { Token } from '@uniswap/sdk'
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  Dispatch,
  ReactNode,
} from 'react'
import { Connectors, useWallet } from 'use-wallet'

enum AppActions {
  OPEN_MODAL,
  CLOSE_MODAL,
  SAVE_WALLET_TYPE,
  RESET_WALLET_TYPE,
  SET_TOKEN_LIST,
  HYDRATE,
}

type AppAction = {
  type: AppActions
  payload?: string | keyof Connectors | Array<Token> | WalletState
}

type WalletState = {
  modalOpen: boolean
  walletType: keyof Connectors
  tokenList: Array<Token>
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
  tokenList: new Array<Token>(),
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
    case AppActions.SET_TOKEN_LIST: {
      return { ...prevState, tokenList: action.payload as Array<Token> }
    }
    case AppActions.HYDRATE: {
      return action.payload as WalletState
    }
    default: {
      return prevState
    }
  }
}

const WalletStateContext = createContext(initialState)
const WalletDispatchContext = createContext<Dispatch<AppAction>>(() => null)

function useWalletState(): [WalletState, Dispatch<AppAction>] {
  const state = useContext(WalletStateContext)
  const dispatch = useContext(WalletDispatchContext)
  return [state, dispatch]
}

type ProviderProps = {
  children?: ReactNode
}

const WalletStateProvider = ({ children }: ProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(stateReducer, initialState)

  useEffect(() => {
    // Hydrate the state on mount
    const savedState = loadState()
    dispatch({ type: AppActions.HYDRATE, payload: savedState })
  }, [])

  useEffect(() => {
    // Save the state
    // TODO: debounce
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

const WalletConnector = (): null => {
  const { status, connect, reset } = useWallet()
  const [{ walletType }, dispatch] = useWalletState()

  useEffect(() => {
    if (
      walletType !== initialState.walletType &&
      !['error', 'connected', 'connecting'].includes(status)
    ) {
      // This should only handle cases where we just loaded a page for
      // the first time
      connect(walletType)
    } else if (status === 'error') {
      reset()
      dispatch({ type: AppActions.RESET_WALLET_TYPE })
    }
  }, [dispatch, walletType, status, connect, reset])

  return null
}

export { WalletStateProvider, useWalletState, AppActions, WalletConnector }
