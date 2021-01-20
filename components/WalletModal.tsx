import Link from 'next/link'
import React from 'react'
import { Connectors, useWallet } from 'use-wallet'
import { AppActions, useWalletState } from '../state/Wallet'
import Gradient from './backgrounds/gradient'
import { Alignment, Column, Justification, Row, Width } from './grid/Flex'
import Button, { ButtonColor, ButtonSize } from './input/Button'
import Modal from './Modal'
import Icon, { IconUrls } from './typography/Icon'
import Spacer from './typography/Spacer'
import { SmallTitle } from './typography/Titles'
import WalletAddress from './WalletAddress'
import WalletIcon from './WalletIcon'

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
              <Row
                justifyContent={Justification.SPACE_BETWEEN}
                alignItems={Alignment.CENTER}
              >
                Metamask
                <WalletIcon walletType={'injected'} />
              </Row>
            </Button>
            <Button
              color={ButtonColor.WHITE}
              onClick={() => connectWallet('walletconnect')}
            >
              <Row
                justifyContent={Justification.SPACE_BETWEEN}
                alignItems={Alignment.CENTER}
              >
                WalletConnect
                <WalletIcon walletType={'walletconnect'} />
              </Row>
            </Button>
          </div>
        </Column>
      </div>
      <div className='modalFooter'>
        <span>
          New to Ethereum? <Link href='/learn'>Learn more about wallets</Link>
        </span>
      </div>
      <style jsx>{`
        div {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          font-size: var(--hugemonosize);
          position: relative;
          max-width: 100%;
        }
        .modalTitle,
        .modalFooter {
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
        <Gradient />
        <div className='mainWrapper'>
          <div className='innerBox'>
            <div className='topRow'>
              Connected with{' '}
              {wallet.connector === 'injected' ? 'Metamask' : wallet.connector}
              <Button onClick={() => resetWallet()} size={ButtonSize.SMALL}>
                Change
              </Button>
            </div>
            <div className='middleSection'>
              <WalletIcon walletType={wallet.connector} />
              <Spacer />
              <WalletAddress wallet={wallet} />
            </div>
            <div className='bottomSection'>
              <button
                onClick={() =>
                  wallet.account &&
                  navigator.clipboard.writeText(wallet.account)
                }
              >
                <Icon src={IconUrls.COPY} />
                Copy address
              </button>
              <a href={`https://etherscan.io/address/${wallet.account}`}>
                <Icon src={IconUrls.ARROW_UP_RIGHT} />
                View on Etherscan
              </a>
            </div>
          </div>
        </div>
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
          position: relative;
          max-width: 100%;
        }
        .modalTitle,
        .modalFooter {
          padding: 1rem 1.5rem;
          width: 100%;
        }
        .modalMain {
          position: relative;
          width: 100%;
        }
        .mainWrapper {
          display: flex;
          flex-direction: column;
          padding: 1rem 1.5rem;
          width: 100%;
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
        .innerBox {
          border-radius: 1rem;
          background: var(--white);
          display: flex;
          flex-direction: column;
        }
        .topRow {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;
          justify-content: space-between;
          font-size: var(--minisize);
          border-bottom: 1px solid #d5d5d5;
          padding: 0.8rem 1rem;
          font-family: var(--bodyfont);
          font-weight: var(--theadweight);
        }
        .middleSection {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: left;
          padding: 1rem 1.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          font-family: var(--monofont);
          font-size: var(--highlightsize);
          font-weight: var(--monoweight);
          border-bottom: 1px solid #d5d5d5;
        }
        .bottomSection {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
        }
        .bottomSection button,
        .bottomSection a {
          display: flex;
          flex-grow: 0;
          flex-shrink: 1;
          width: fit-content;
          text-decoration: none;
          color: var(--dark);
          font-family: var(--bodyfont);
          font-size: var(--minisize);
          font-weight: var(--theadweight);
          opacity: 0.7;
          background: transparent;
          border: 0;
          cursor: pointer;
          outline: none;
        }
        .modalFooter {
          font-style: italic;
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
