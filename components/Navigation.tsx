import { useWallet } from 'use-wallet'
import { AppActions, useWalletState } from '../state/Wallet'
import Button from './input/Button'
import NavLink from './NavLink'
import SmallWalletInfo from './SmallWalletInfo'
import { useIsSmallerThan } from '../hooks/breakpoints'

const ConnectWalletButton = (): JSX.Element => {
  const [WalletState, dispatch] = useWalletState()
  return (
    <>
      <Button
        onClick={() =>
          dispatch({
            type: WalletState.modalOpen
              ? AppActions.CLOSE_MODAL
              : AppActions.OPEN_MODAL,
          })
        }
      >
        Connect Wallet
      </Button>
      <style jsx>{`
        .connectButton {
          margin: 2rem 0;
        }
        @media (min-width: 680px) {
          .connectButton {
            margin: 0;
          }
        }
      `}</style>
    </>
  )
}

const Navigation = (): JSX.Element => {
  const wallet = useWallet()
  const smallerThan = useIsSmallerThan()
  return (
    <nav>
      <NavLink href='/'>Home</NavLink>
      <NavLink href='/trade'>Trade</NavLink>
      <NavLink href='/faq'>FAQ</NavLink>
      {wallet.status !== 'connected' ? (
        <ConnectWalletButton />
      ) : (
        !smallerThan.sm && <SmallWalletInfo />
      )}
      <style jsx>{`
        nav {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 6rem 2rem;
          justify-content: flex-start;
          align-items: left;
          line-height: 1rem;
        }
        @media (min-width: 680px) {
          nav {
            display: flex;
            padding: 0;
            flex-direction: row;
            height: 100%;
            justify-content: center;
            align-items: center;
          }
        }
      `}</style>
    </nav>
  )
}

export default Navigation
