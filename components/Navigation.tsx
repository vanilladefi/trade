import React from 'react'
import Button from './input/Button'
import NavLink from './NavLink'
import { useWallet, WalletActions } from './state/Wallet'

const Navigation = (): JSX.Element => {
  const [state, dispatch] = useWallet()
  React.useEffect(() => console.log('State changed?'), [state])
  return (
    <nav>
      <NavLink href='/'>Home</NavLink>
      <NavLink href='/trade'>Trade</NavLink>
      <NavLink href='/users'>Stake</NavLink>
      {state.defaultProvider ? (
        <div className='connectButton'>
          <Button
            onClick={() =>
              dispatch({
                type: state.modalOpen
                  ? WalletActions.CLOSE_MODAL
                  : WalletActions.OPEN_MODAL,
              })
            }
          >
            Connect Wallet
          </Button>
        </div>
      ) : (
        <Button
          onClick={() =>
            dispatch({
              type: state.modalOpen
                ? WalletActions.CLOSE_MODAL
                : WalletActions.OPEN_MODAL,
            })
          }
        >
          Wallet
        </Button>
      )}
      <style jsx>{`
        nav {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 6rem 2rem;
          justify-content: flex-start;
          align-items: left;
        }
        .connectButton {
          margin: 2rem 0;
        }
        @media (min-width: 680px) {
          nav {
            display: flex;
            padding: 0;
          }
        }
      `}</style>
    </nav>
  )
}

export default Navigation
