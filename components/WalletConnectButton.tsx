import { useRecoilState } from 'recoil'
import { walletModalOpenState } from 'state/wallet'
import { BreakPoint } from './GlobalStyles/Breakpoints'
import Button, { ButtonSize } from './input/Button'

export default function WalletConnectButton(): JSX.Element {
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
