import { utils } from 'ethers'
import React from 'react'
import { useWallet } from 'use-wallet'
import Button, {
  ButtonColor,
  ButtonGroup,
  Overflow,
  Rounding
} from './input/Button'
import NavLink from './NavLink'
import { AppActions, useAppState } from './State'

const Navigation = (): JSX.Element => {
  const wallet = useWallet()
  const [appState, dispatch] = useAppState()

  return (
    <nav>
      <NavLink href='/'>Home</NavLink>
      <NavLink href='/trade'>Trade</NavLink>
      <NavLink href='/users'>Stake</NavLink>
      {wallet.status === 'disconnected' ? (
        <Button
          onClick={() =>
            dispatch({
              type: appState.modalOpen
                ? AppActions.CLOSE_MODAL
                : AppActions.OPEN_MODAL,
            })
          }
        >
          Connect Wallet
        </Button>
      ) : (
        <ButtonGroup>
          <Button
            onClick={() =>
              dispatch({
                type: appState.modalOpen
                  ? AppActions.CLOSE_MODAL
                  : AppActions.OPEN_MODAL,
              })
            }
            rounded={Rounding.LEFT}
            color={ButtonColor.TRANSPARENT}
            bordered
            noRightBorder
          >
            {utils.formatUnits(wallet.balance, 'ether')} ETH
          </Button>
          <Button
            color={ButtonColor.TRANSPARENT}
            bordered
            rounded={Rounding.RIGHT}
            width='200'
            overflow={Overflow.ELLIPSIS}
          >
            {wallet.account}
          </Button>
        </ButtonGroup>
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
