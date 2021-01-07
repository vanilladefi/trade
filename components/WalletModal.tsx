import Modal from './Modal'
import { useWallet, WalletActions } from './state/Wallet'

const WalletModal = (): JSX.Element => {
  const [wallet, dispatch] = useWallet()
  return (
    <Modal
      open={wallet.modalOpen}
      onRequestClose={() => dispatch({ type: WalletActions.CLOSE_MODAL })}
    >
      asd
    </Modal>
  )
}

export default WalletModal
