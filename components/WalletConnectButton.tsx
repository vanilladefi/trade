import { BreakPoint } from 'components/GlobalStyles/Breakpoints'
import { ButtonSize } from 'components/input/Button'
import dynamic from 'next/dynamic'
import { useRecoilState } from 'recoil'
import { walletModalOpenState } from 'state/wallet'

const Button = dynamic(import('components/input/Button'))

const WalletConnectButton: React.FC = () => {
  const [walletModalOpen, setWalletModalOpen] =
    useRecoilState(walletModalOpenState)
  return (
    <>
      <Button
        size={ButtonSize.SMALL}
        onClick={() => {
          setWalletModalOpen(!walletModalOpen)
        }}
      >
        Connect Wallet
      </Button>
      <style jsx>{`
        .connectButton {
          margin: 2rem 0;
        }
        @media (min-width: ${BreakPoint.mobileNav}px) {
          .connectButton {
            margin: 0;
          }
        }
      `}</style>
    </>
  )
}

export default WalletConnectButton
