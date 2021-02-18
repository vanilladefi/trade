import { utils as ethersUtils } from 'ethers'
import { useMemo } from 'react'
import { useWallet } from 'use-wallet'
import { useRecoilState } from 'recoil'
import { walletModalOpenState } from 'state/wallet'
import { Alignment, Justification, Row } from './grid/Flex'
import BottomFloater from './BottomFloater'
import Button, {
  ButtonColor,
  ButtonGroup,
  ButtonSize,
  Overflow,
  Rounding,
} from './input/Button'
import Spacer from './typography/Spacer'
import WalletAddress from './typography/WalletAddress'
import WalletIcon from './typography/WalletIcon'
import { BreakPoint } from './GlobalStyles/Breakpoints'
import WalletConnectButton from './WalletConnectButton'

interface SmallWalletInfoProps {
  grow?: boolean
}

const SmallWalletInfo = ({ grow }: SmallWalletInfoProps): JSX.Element => {
  const wallet = useWallet()
  const [walletModalOpen, setWalletModalOpen] = useRecoilState(
    walletModalOpenState,
  )

  const walletBalance = useMemo(() => {
    return Number.parseFloat(
      ethersUtils.formatUnits(wallet.balance, 'ether'),
    ).toFixed(3)
  }, [wallet.balance])

  const walletAddress = useMemo(() => {
    const long = wallet.account || ''
    const short = wallet.account
      ? `${wallet.account.substring(0, 6)}...${wallet.account.substring(
          wallet.account.length - 4,
        )}`
      : ''
    return { long, short }
  }, [wallet.account])

  if (wallet.status !== 'connected') return <WalletConnectButton />

  return (
    <ButtonGroup grow={grow}>
      <Button
        onClick={() => {
          setWalletModalOpen(!walletModalOpen)
        }}
        size={ButtonSize.SMALL}
        rounded={Rounding.LEFT}
        color={ButtonColor.TRANSPARENT}
        bordered
        noRightBorder
        grow={grow}
      >
        {walletBalance} ETH
      </Button>
      <Button
        onClick={() => {
          setWalletModalOpen(!walletModalOpen)
        }}
        size={ButtonSize.SMALL}
        color={ButtonColor.TRANSPARENT}
        bordered
        rounded={Rounding.RIGHT}
        overflow={Overflow.ELLIPSIS}
        title={walletAddress.long}
        grow={grow}
        justifyContent={Justification.CENTER}
      >
        <Row
          alignItems={Alignment.CENTER}
          justifyContent={Justification.SPACE_AROUND}
        >
          <WalletAddress wallet={wallet} />
          <Spacer />
          <WalletIcon walletType={wallet.connector} />
        </Row>
      </Button>
    </ButtonGroup>
  )
}

export const MobileWalletFloater = (): JSX.Element => {
  return (
    <>
      <BottomFloater>
        <div className='walletInfoWrapper'>
          <SmallWalletInfo grow />
        </div>
      </BottomFloater>
      <style jsx>{`
        .walletInfoWrapper {
          width: 100%;
          background: var(--white);
          padding: 1rem;
          display: flex;
          flex-direction: row;
          justify-content: center;
        }
        .walletInfoWrapper * {
          display: flex;
          flex-grow: 1;
          width: 100%;
        }

        @media (min-width: ${BreakPoint.mobileNav}px) {
          .walletInfoWrapper {
            display: none;
          }
        }
      `}</style>
    </>
  )
}

export default SmallWalletInfo
