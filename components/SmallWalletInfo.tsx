import { utils as ethersUtils } from 'ethers'
import { useMemo } from 'react'
import { useRecoilState } from 'recoil'
import { walletModalOpenState } from 'state/wallet'
import { useWallet } from 'use-wallet'
import BottomFloater from './BottomFloater'
import { BreakPoint } from './GlobalStyles/Breakpoints'
import { Alignment, Justification, Row } from './grid/Flex'
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
import WalletConnectButton from './WalletConnectButton'

interface SmallWalletInfoProps {
  grow?: boolean
}

const SmallWalletInfo = ({ grow }: SmallWalletInfoProps): JSX.Element => {
  const wallet = useWallet()
  const { account, status, balance } = wallet
  const [walletModalOpen, setWalletModalOpen] = useRecoilState(
    walletModalOpenState,
  )

  const walletBalance = useMemo(() => {
    return Number.parseFloat(ethersUtils.formatUnits(balance, 'ether')).toFixed(
      3,
    )
  }, [balance])

  const walletAddress = useMemo(() => {
    const long = account || ''
    const short = account
      ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
      : ''
    return { long, short }
  }, [account])

  if (status !== 'connected') return <WalletConnectButton />

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
