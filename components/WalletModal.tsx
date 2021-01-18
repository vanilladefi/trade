import { utils } from 'ethers'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { Connectors, useWallet } from 'use-wallet'
import { AppActions, useWalletState } from '../state/Wallet'
import Gradient from './backgrounds/gradient'
import { Column, Width } from './grid/Flex'
import Button, { ButtonColor } from './input/Button'
import Modal from './Modal'
import { SmallTitle } from './typography/Titles'

const ProviderOptions = (): JSX.Element => {
  const wallet = useWallet()
  const [, dispatch] = useWalletState()

  const connectWallet = (walletType: keyof Connectors): void => {
    wallet.connect(walletType)
    dispatch({ type: AppActions.SAVE_WALLET_TYPE, payload: walletType })
  }

  return (
    <Column>
      <div className='modalTitle'>
        <SmallTitle>CONNECT TO A WALLET</SmallTitle>
      </div>
      <div className='modalMain'>
        <Column width={Width.TWELVE}>
          <Gradient />
          <div className='buttons'>
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
          </div>
        </Column>
      </div>
      <div className='modalFooter'>
        <span>New to Ethereum? <Link href='/learn'>Learn more about wallets</Link></span>
      </div>
      <style jsx>{`
        div {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          font-size: var(--hugemonosize);
        }
        .modalTitle, .modalFooter {
          padding: 1rem 1.5rem;
          width: 100%;
        }
        .modalMain {
          position: relative;
          width: 100%;
        }
        .buttons {
          display: flex;
          flex-direction: column;
          padding: 1rem 1.5rem;
          width: 100%;
          --buttonmargin: 0.4rem 0;
        }
        span {
          text-align: center;
          width: 100%;
          font-size: var(--minisize);
        }
        span > * {
          color: var(--beige);
        }
      `}</style>
    </Column>
  )
}

const WalletView = (): JSX.Element => {
  const wallet = useWallet()
  const [, dispatch] = useWalletState()

  const resetWallet = (): void => {
    wallet.reset()
    dispatch({ type: AppActions.RESET_WALLET_TYPE })
  }

  return (
    <>
      <div className='modalTitle'>
        <SmallTitle>ACCOUNT</SmallTitle>
      </div>
      <div className='modalMain'>
        <Column width={Width.TWELVE}>
          <Gradient />
          <div className='buttons'>
            Connected with {wallet.connector === 'injected' ? 'Metamask' : wallet.connector}
          </div>
          <Button onClick={() => resetWallet()}>Change</Button>
        </Column>
      </div>
      <div className='modalFooter'>
        <span>Your transactions will appear here</span>
      </div>
      <style jsx>{`
        div {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          font-size: var(--hugemonosize);
        }
        .modalTitle, .modalFooter {
          padding: 1rem 1.5rem;
          width: 100%;
        }
        .modalMain {
          position: relative;
          width: 100%;
        }
        .buttons {
          display: flex;
          flex-direction: column;
          padding: 1rem 1.5rem;
          width: 100%;
          --buttonmargin: 0.4rem 0;
          font-size: var(--minisize);
        }
        span {
          text-align: center;
          width: 100%;
          font-size: var(--minisize);
        }
        span > * {
          color: var(--beige);
        }
      `}</style>
    </>
  )
}

const WalletModal = (): JSX.Element => {
  const [WalletState, dispatch] = useWalletState()
  const wallet = useWallet()
  return (
    <Modal
      open={WalletState.modalOpen}
      onRequestClose={() => dispatch({ type: AppActions.CLOSE_MODAL })}
    >
      {wallet.status === 'disconnected' && <ProviderOptions />}
      {wallet.status === 'connected' && <WalletView />}
    </Modal>
  )
}

export default WalletModal
