import { ethers } from 'ethers'
import React from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { userV2TokensState, userV3TokensState } from 'state/tokens'
import { walletModalOpenState } from 'state/wallet'
import { Connectors, useWallet, Wallet } from 'use-wallet'
import { ModalGradient } from './backgrounds/gradient'
import { Alignment, Column, Justification, Row, Width } from './grid/Flex'
import Button, { ButtonColor, ButtonSize } from './input/Button'
import Modal from './Modal'
import Icon, { IconUrls } from './typography/Icon'
import Spacer from './typography/Spacer'
import { SmallTitle } from './typography/Titles'
import WalletAddress from './typography/WalletAddress'
import WalletIcon from './typography/WalletIcon'

const ProviderOptions = (): JSX.Element => {
  const wallet = useWallet()

  const connectWallet = async (connector: keyof Connectors) => {
    await wallet.connect(connector)
  }

  const [errorMessage, setErrorMessage] = React.useState('')

  React.useEffect(() => {
    if (wallet.status === 'error') {
      setErrorMessage(
        'Wallet connection failed. Check that you are using the Ethereum mainnet.',
      )
    }
  }, [wallet.status])

  return (
    <Column>
      <div className='modalTitle'>
        <SmallTitle>CONNECT TO A WALLET</SmallTitle>
      </div>
      <div className='modalMain'>
        <Column width={Width.TWELVE}>
          <ModalGradient />
          <div className='buttons'>
            {errorMessage !== '' && (
              <Button
                onClick={() => setErrorMessage('')}
                color={ButtonColor.TRANSPARENT}
              >
                {errorMessage}
              </Button>
            )}
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
            {/* <Button
              color={ButtonColor.WHITE}
              onClick={() => connectWallet('ledger')}
            >
              <Row
                justifyContent={Justification.SPACE_BETWEEN}
                alignItems={Alignment.CENTER}
              >
                Ledger
                <WalletIcon walletType={'ledger'} />
              </Row>
            </Button> */}
          </div>
        </Column>
      </div>
      <div className='modalFooter'>
        <span>
          New to Ethereum?{' '}
          <a
            href='https://ethereum.org/en/wallets/'
            target='_blank'
            rel='noreferrer noopener'
          >
            Learn more about wallets
          </a>
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
          width: 30rem;
          overflow-y: scroll;
          max-height: var(--modal-maxheight);
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .modalMain::-webkit-scrollbar {
          display: none;
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
          color: var(--link-on-white);
        }
      `}</style>
    </Column>
  )
}

const WalletView = (): JSX.Element => {
  const wallet = useWallet<Wallet<ethers.Signer>>()
  const { account, connector } = wallet
  const setV2Tokens = useSetRecoilState(userV2TokensState)
  const setV3Tokens = useSetRecoilState(userV3TokensState)

  const resetWallet = (): void => {
    // Reset user owned tokens status
    setV2Tokens([])
    setV3Tokens([])
    wallet.reset()
  }

  return (
    <>
      <div className='modalTitle'>
        <SmallTitle>ACCOUNT</SmallTitle>
      </div>
      <div className='modalMain'>
        <ModalGradient />
        <div className='mainWrapper'>
          <div className='innerBox'>
            <div className='topRow'>
              {account ? 'Connected with ' : 'Connecting with '}
              {connector === 'injected' ? 'Metamask' : connector}
              <Button onClick={() => resetWallet()} size={ButtonSize.SMALL}>
                Disconnect
              </Button>
            </div>
            <div className='middleSection'>
              {account ? (
                <>
                  <WalletIcon walletType={connector} />
                  <Spacer />
                  <WalletAddress wallet={wallet} />
                </>
              ) : (
                'Connecting...'
              )}
            </div>
            {account && (
              <div className='bottomSection'>
                <button
                  onClick={() =>
                    account && navigator.clipboard.writeText(account)
                  }
                >
                  <Icon src={IconUrls.COPY} />
                  Copy address
                </button>
                <a href={`https://etherscan.io/address/${account}`}>
                  <Icon src={IconUrls.ARROW_UP_RIGHT} />
                  View on Etherscan
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='modalFooter'>{/* <TransactionList /> */}</div>
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
          overflow-y: scroll;
          max-height: var(--modal-maxheight);
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .modalMain::-webkit-scrollbar {
          display: none;
        }
        .mainWrapper {
          display: flex;
          flex-direction: column;
          padding: 1rem 1.5rem;
          width: 30rem;
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
          --iconsize: 1rem;
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
          margin: 0;
          padding: 0;
          transition: opacity 0.3s;
        }
        .bottomSection button:hover,
        .bottomSection a:hover {
          opacity: 1;
        }
        .modalFooter {
          font-style: italic;
        }
        a {
          pointer-events: all !important;
        }
      `}</style>
    </>
  )
}

const WalletModal = (): JSX.Element => {
  const { status } = useWallet()

  const [walletModalOpen, setWalletModalOpen] =
    useRecoilState(walletModalOpenState)

  return (
    <Modal
      open={walletModalOpen}
      onRequestClose={() => {
        setWalletModalOpen(false)
      }}
    >
      {['disconnected', 'error'].includes(status) && <ProviderOptions />}
      {['connected', 'connecting'].includes(status) && <WalletView />}
    </Modal>
  )
}

export default WalletModal
