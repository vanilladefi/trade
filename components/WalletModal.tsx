import { utils } from 'ethers'
import { useWallet } from 'use-wallet'
import Button from './input/Button'
import Modal from './Modal'
import { AppActions, useAppState } from './State'

const ProviderOptions = (): JSX.Element => {
  const wallet = useWallet()
  return (
    <>
      <Button onClick={() => wallet.connect('injected')}>Metamask</Button>
      <Button onClick={() => wallet.connect('walletconnect')}>
        WalletConnect
      </Button>
    </>
  )
}

const WalletView = (): JSX.Element => {
  const wallet = useWallet()
  return (
    <>
      <Button onClick={() => wallet.reset()}>Disconnect</Button>

      <h2>Wallet Balance:</h2>
      <span>{utils.formatUnits(wallet.balance, 'ether')} ETH</span>
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
