import { utils as ethersUtils } from 'ethers'
import useVanillaGovernanceToken from 'hooks/useVanillaGovernanceToken'
import dynamic from 'next/dynamic'
import { useCallback, useMemo } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { tokenConversionState } from 'state/migration'
import { walletModalOpenState } from 'state/wallet'
import { PrerenderProps } from 'types/content'
import { VanillaVersion } from 'types/general'
import { ConversionState } from 'types/migration'
import { useWallet } from 'use-wallet'
import { BreakPoint } from './GlobalStyles/Breakpoints'
import { Alignment, Justification } from './grid/Flex'
import {
  ButtonColor,
  ButtonGroup,
  ButtonSize,
  Opacity,
  Overflow,
  Rounding,
} from './input/Button'

const WalletIcon = dynamic(import('components/typography/WalletIcon'))
const Spacer = dynamic(import('components/typography/Spacer'))
const WalletConnectButton = dynamic(import('components/WalletConnectButton'))
const Button = dynamic(import('components/input/Button'))
const Row = dynamic(import('components/grid/Flex').then((mod) => mod.Row))
const BottomFloater = dynamic(import('components/BottomFloater'))

type SmallWalletInfoProps = PrerenderProps & {
  grow?: boolean
}

const SmallWalletInfo: React.FC<SmallWalletInfoProps> = ({
  grow,
  vnlBalance,
  ethBalance,
  walletAddress,
}: SmallWalletInfoProps) => {
  const { status, balance, connector } = useWallet()
  const [walletModalOpen, setWalletModalOpen] =
    useRecoilState(walletModalOpenState)

  const { balance: legacyBalance } = useVanillaGovernanceToken(
    VanillaVersion.V1_0,
  )
  const { balance: activeVnlBalance } = useVanillaGovernanceToken(
    VanillaVersion.V1_1,
  )

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
    const prerenderedBalance = Number(Number(vnlBalance || '0').toFixed(1))
    const legacyAmount = Number(legacyBalance)
    const vnlAmount =
      prerenderedBalance > 0 &&
      Number(activeVnlBalance) > 0 &&
      prerenderedBalance !== Number(activeVnlBalance)
        ? Number(activeVnlBalance)
        : prerenderedBalance
    return legacyAmount + vnlAmount
  }, [legacyBalance, vnlBalance, activeVnlBalance])

  const walletBalance = useMemo(() => {
    const prerenderedBalance = Number(ethBalance || '0')
    const activeBalance = Number.parseFloat(
      ethersUtils.formatUnits(balance, 'ether'),
    )
    const returnedBalance =
      prerenderedBalance > 0 &&
      activeBalance > 0 &&
      prerenderedBalance !== activeBalance
        ? activeBalance
        : prerenderedBalance
    return returnedBalance.toFixed(3)
  }, [balance, ethBalance])

  return !walletAddress ? (
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
        title={walletAddress || ''}
        grow={grow}
        justifyContent={Justification.CENTER}
      >
        <Row
          alignItems={Alignment.CENTER}
          justifyContent={Justification.SPACE_AROUND}
        >
          {walletBalance} ETH
          {status === 'connected' && (
            <>
              <Spacer />
              <WalletIcon walletType={connector} />
            </>
          )}
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
