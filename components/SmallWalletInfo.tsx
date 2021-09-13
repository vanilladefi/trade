import { utils as ethersUtils } from 'ethers'
import useVanillaGovernanceToken from 'hooks/useVanillaGovernanceToken'
import useWalletAddress from 'hooks/useWalletAddress'
import { useCallback, useMemo } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { tokenConversionState } from 'state/migration'
import { walletModalOpenState } from 'state/wallet'
import { PrerenderProps } from 'types/content'
import { VanillaVersion } from 'types/general'
import { ConversionState } from 'types/migration'
import { useWallet } from 'use-wallet'
import BottomFloater from './BottomFloater'
import { BreakPoint } from './GlobalStyles/Breakpoints'
import { Alignment, Justification, Row } from './grid/Flex'
import Button, {
  ButtonColor,
  ButtonGroup,
  ButtonSize,
  Opacity,
  Overflow,
  Rounding,
} from './input/Button'
import Spacer from './typography/Spacer'
import WalletIcon from './typography/WalletIcon'
import WalletConnectButton from './WalletConnectButton'

interface SmallWalletInfoProps {
  grow?: boolean
  prerenderProps?: PrerenderProps
}

const SmallWalletInfo = ({
  grow,
  prerenderProps,
}: SmallWalletInfoProps): JSX.Element => {
  const { status, balance, connector } = useWallet()
  const [walletModalOpen, setWalletModalOpen] =
    useRecoilState(walletModalOpenState)
  const { balance: legacyBalance } = useVanillaGovernanceToken(
    VanillaVersion.V1_0,
  )
  const { balance: vnlBalance } = useVanillaGovernanceToken(VanillaVersion.V1_1)
  const setTokenConversionState = useSetRecoilState(tokenConversionState)

  const getLegacyBalanceState = useCallback(() => {
    let userHasLegacyBalance = false
    try {
      userHasLegacyBalance = Number(legacyBalance) > 0
    } catch (e) {
      userHasLegacyBalance = true
    }
    return userHasLegacyBalance
  }, [legacyBalance])

  const getVnlBalance = useCallback(() => {
    const legacyAmount = Number(legacyBalance)
    const vnlAmount = Number(vnlBalance)
    return legacyAmount + vnlAmount
  }, [legacyBalance, vnlBalance])

  const walletBalance = useMemo(() => {
    return Number.parseFloat(ethersUtils.formatUnits(balance, 'ether')).toFixed(
      3,
    )
  }, [balance])

  const walletAddress = useWalletAddress(prerenderProps)

  return status !== 'connected' && !walletAddress ? (
    <WalletConnectButton />
  ) : (
    <ButtonGroup grow={grow}>
      <Button
        onClick={() => {
          getLegacyBalanceState() &&
            setTokenConversionState(ConversionState.LOADING)
          setWalletModalOpen(!walletModalOpen)
        }}
        size={ButtonSize.SMALL}
        rounded={Rounding.LEFT}
        color={ButtonColor.TRANSPARENT}
        bordered
        noRightBorder
        grow={grow}
        opacity={getLegacyBalanceState() ? Opacity.SEETHROUGH : undefined}
        title={
          getLegacyBalanceState()
            ? "You've got unconverted v1.0 balances!"
            : undefined
        }
      >
        {getVnlBalance()} VNL
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
          {walletBalance} ETH
          <Spacer />
          <WalletIcon walletType={connector} />
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
          padding: 0.6rem;
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
