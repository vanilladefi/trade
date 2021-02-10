import { utils } from 'ethers'
import { useMemo } from 'react'
import { useRecoilState } from 'recoil'
import { walletModalOpenState } from 'state/wallet'
import { useWallet } from 'use-wallet'
import { useBreakpoints } from '../hooks/breakpoints'
import BottomFloater from './BottomFloater'
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

type Props = {
  grow?: boolean
}

const SmallWalletInfo = ({ grow }: Props): JSX.Element => {
  const wallet = useWallet()
  const [walletModalOpen, setWalletModalOpen] = useRecoilState(
    walletModalOpenState,
  )

  const walletBalance = useMemo(() => {
    return Number.parseFloat(
      utils.formatUnits(wallet.balance, 'ether'),
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
        color={ButtonColor.TRANSPARENT}
        bordered
        size={ButtonSize.SMALL}
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
  const wallet = useWallet()
  const { isSmaller } = useBreakpoints()
  return (
    <>
      {wallet.account && isSmaller.sm && (
        <BottomFloater>
          <div className='walletInfoWrapper'>
            <SmallWalletInfo grow />
          </div>
        </BottomFloater>
      )}
      <style jsx>{`
        .walletInfoWrapper {
          width: 100vw;
          background: var(--white);
          padding: 1rem;
          display: flex;
          flex-direction: row;
          justify-content: stretch;
        }
        .walletInfoWrapper * {
          display: flex;
          flex-grow: 1;
          width: 100%;
        }
      `}</style>
    </>
  )
}

export default SmallWalletInfo
