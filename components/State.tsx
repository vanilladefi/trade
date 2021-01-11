import React, { Dispatch, ReactNode } from 'react'

enum AppActions {
  OPEN_MODAL,
  CLOSE_MODAL,
}

type AppAction = {
  type: AppActions
  payload?: string
}

type AppState = {
  modalOpen: boolean
}

//
// State
//
const initialState = {
  modalOpen: false,
}

function stateReducer(prevState: AppState, action: AppAction): AppState {
  switch (action.type) {
    case AppActions.OPEN_MODAL: {
      return { ...prevState, modalOpen: true }
    }
    case AppActions.CLOSE_MODAL: {
      return { ...prevState, modalOpen: false }
    }
  }
}

//
// React contexts
//
const AppStateContext = React.createContext(initialState)
const AppDispatchContext = React.createContext<Dispatch<AppAction>>(() => null)

//
// Primary exports
//
function useAppState(): [AppState, React.Dispatch<AppAction>] {
  const state = React.useContext(AppStateContext)
  const dispatch = React.useContext(AppDispatchContext)
  return [state, dispatch]
}

type ProviderProps = {
  children?: ReactNode
}

const AppStateProvider = ({ children }: ProviderProps): JSX.Element => {
  const [state, dispatch] = React.useReducer(stateReducer, initialState)
  return (
    <AppDispatchContext.Provider value={dispatch}>
      <AppStateContext.Provider value={state}>
        {children}
      </AppStateContext.Provider>
    </AppDispatchContext.Provider>
  )
}

export { AppStateProvider, useAppState, AppActions }
