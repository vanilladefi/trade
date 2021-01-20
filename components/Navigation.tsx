import { utils } from 'ethers'
import React, { useMemo } from 'react'
import { useWallet } from 'use-wallet'
import { AppActions, useWalletState } from '../state/Wallet'
import { Alignment, Row } from './grid/Flex'
import Button, {
  ButtonColor,
  ButtonGroup,
  Overflow,
  Rounding
} from './input/Button'
import NavLink from './NavLink'
import Spacer from './typography/Spacer'
import WalletAddress from './typography/WalletAddress'
import WalletIcon from './typography/WalletIcon'

const Navigation = (): JSX.Element => {
  const wallet = useWallet()
  const [WalletState, dispatch] = useWalletState()

  const walletBalance = useMemo(() => {
    return Number.parseFloat(
      utils.formatUnits(wallet.balance, 'ether')
    ).toFixed(3)
  }, [wallet.balance])

  const walletAddress = useMemo(() => {
    const long = wallet.account || ''
    const short = wallet.account
      ? `${wallet.account.substring(0, 6)}...${wallet.account.substring(
          wallet.account.length - 4
        )}`
      : ''
    return { long, short }
  }, [wallet.account])

  return (
    <nav>
      <NavLink href='/'>Home</NavLink>
      <NavLink href='/trade'>Trade</NavLink>
      {wallet.status === 'disconnected' ? (
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
      ) : (
        <ButtonGroup>
          <Button
            onClick={() =>
              dispatch({
                type: WalletState.modalOpen
                  ? AppActions.CLOSE_MODAL
                  : AppActions.OPEN_MODAL,
              })
            }
            rounded={Rounding.LEFT}
            color={ButtonColor.TRANSPARENT}
            bordered
            noRightBorder
          >
            {walletBalance} ETH
          </Button>
          <Button
            onClick={() =>
              dispatch({
                type: WalletState.modalOpen
                  ? AppActions.CLOSE_MODAL
                  : AppActions.OPEN_MODAL,
              })
            }
            color={ButtonColor.TRANSPARENT}
            bordered
            rounded={Rounding.RIGHT}
            overflow={Overflow.ELLIPSIS}
            title={walletAddress.long}
          >
            <Row alignItems={Alignment.CENTER}>
              <WalletAddress wallet={wallet} />
              <Spacer />
              <WalletIcon walletType={wallet.connector} />
            </Row>
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
          line-height: 1rem;
        }
        .connectButton {
          margin: 2rem 0;
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
          .connectButton {
            margin: 0;
          }
        }
      `}</style>
    </nav>
  )
}

export default Navigation
