import { utils } from 'ethers'
import React, { useMemo } from 'react'
import { Connectors, useWallet } from 'use-wallet'
import Gradient from './backgrounds/gradient'
import { Column, Width } from './grid/Flex'
import Button, { ButtonColor } from './input/Button'
import Modal from './Modal'
import { AppActions, useAppState } from './State'
import { SmallTitle } from './typography/Titles'

const ProviderOptions = (): JSX.Element => {
  const wallet = useWallet()
  const [, dispatch] = useAppState()

  const connectWallet = (walletType: keyof Connectors): void => {
    wallet.connect(walletType)
    dispatch({ type: AppActions.SAVE_WALLET_TYPE, payload: walletType })
  }

  return (
    <Column>
      <div>
        <SmallTitle>CONNECT TO A WALLET</SmallTitle>
      </div>
      <div>
        <Column width={Width.TWELVE}>
          <Gradient />
          <Button
            color={ButtonColor.WHITE}
            onClick={() => connectWallet('injected')}
          >
            Metamask
          </Button>
          <Button
            color={ButtonColor.WHITE}
            onClick={() => connectWallet('walletconnect')}
          >
            WalletConnect
          </Button>
        </Column>
      </div>
      <style jsx>{`
        div {
          display: flex;
          flex-direction: row;
          padding: 19px 17px;
          justify-content: space-between;
        }
      `}</style>
    </Column>
  )
}

const WalletView = (): JSX.Element => {
  const wallet = useWallet()
  const [, dispatch] = useAppState()

  const walletBalance = useMemo(() => {
    return Number.parseFloat(
      utils.formatUnits(wallet.balance, 'ether')
    ).toFixed(3)
  }, [wallet])

  const resetWallet = (): void => {
    wallet.reset()
    dispatch({ type: AppActions.RESET_WALLET_TYPE })
  }

  return (
    <>
      <Button onClick={() => resetWallet()}>Disconnect</Button>
      <h2>Wallet Balance:</h2>
      <span>{walletBalance} ETH</span>
    </>
  )
}

const WalletModal = (): JSX.Element => {
  const [appState, dispatch] = useAppState()
  const wallet = useWallet()
  return (
    <Modal
      open={appState.modalOpen}
      onRequestClose={() => dispatch({ type: AppActions.CLOSE_MODAL })}
    >
      {wallet.status === 'disconnected' && <ProviderOptions />}
      {wallet.status === 'connected' && <WalletView />}
    </Modal>
  )
}

export default WalletModal
