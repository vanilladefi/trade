import { utils } from 'ethers'
import React, { useMemo } from 'react'
import { useWallet } from 'use-wallet'
import { AppActions, useWalletState } from '../state/Wallet'
import { Alignment, Justification, Row } from './grid/Flex'
import BottomFloater from './BottomFloater'
import Button, {
  ButtonColor,
  ButtonGroup,
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
  const [WalletState, dispatch] = useWalletState()

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
    <ButtonGroup grow={grow ? grow : undefined}>
      {wallet.account && (
        <>
          <Button
            onClick={() =>
              dispatch({
                type: WalletState.modalOpen
                  ? AppActions.CLOSE_MODAL
                  : AppActions.OPEN_MODAL,
              })
            }
            rounded={Rounding.LEFT}
            color={ButtonColor.TRANSPARENT}
            bordered
            noRightBorder
            grow={grow}
          >
            {walletBalance} ETH
          </Button>
          <Button
            onClick={() =>
              dispatch({
                type: WalletState.modalOpen
                  ? AppActions.CLOSE_MODAL
                  : AppActions.OPEN_MODAL,
              })
            }
            color={ButtonColor.TRANSPARENT}
            bordered
            rounded={Rounding.RIGHT}
            overflow={Overflow.ELLIPSIS}
            title={walletAddress.long}
            grow={grow}
            justifyContent={Justification.CENTER}
          >
            <Row alignItems={Alignment.CENTER}>
              <WalletAddress wallet={wallet} />
              <Spacer />
              <WalletIcon walletType={wallet.connector} />
            </Row>
          </Button>
        </>
      )}
    </ButtonGroup>
  )
}

export const MobileWalletFloater = (): JSX.Element => {
  return (
    <BottomFloater>
      <div className='walletInfoWrapper'>
        <SmallWalletInfo grow />
      </div>
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
    </BottomFloater>
  )
}

export default SmallWalletInfo
