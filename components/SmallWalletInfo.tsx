import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import useVanillaGovernanceToken from 'hooks/useVanillaGovernanceToken'
import useWalletConnector from 'hooks/useWalletConnector'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { tokenConversionState } from 'state/migration'
import { walletModalOpenState } from 'state/wallet'
import { PrerenderProps } from 'types/content'
import { VanillaVersion } from 'types/general'
import { ConversionState } from 'types/migration'
import { useWallet } from 'use-wallet'
import { defaultProvider } from 'utils/config'
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
  useWalletConnector()

  const { status, balance, connector, account } = useWallet()
  const [walletModalOpen, setWalletModalOpen] =
    useRecoilState(walletModalOpenState)
  const setTokenConversionState = useSetRecoilState(tokenConversionState)

  const { balance: legacyBalance } = useVanillaGovernanceToken(
    VanillaVersion.V1_0,
    { walletAddress },
  )
  const { balance: activeVnlBalance } = useVanillaGovernanceToken(
    VanillaVersion.V1_1,
    { walletAddress },
  )

  const [walletBalance, setWalletBalance] = useState(
    Number(ethBalance || '0').toFixed(3),
  )
  const [walletVnlBalance, setWalletVnlBalance] = useState(
    Number(vnlBalance || '0').toFixed(1),
  )

  useEffect(() => {
    const fetchBalances = async () => {
      const activeBalance = formatUnits(
        (walletAddress && (await defaultProvider.getBalance(walletAddress))) ||
          balance ||
          BigNumber.from(0),
      )
      const returnedBalance =
        (Number(walletBalance) > 0 || Number(activeBalance) > 0) &&
        Number(walletBalance) !== Number(activeBalance)
          ? Number(activeBalance)
          : Number(walletBalance)
      setWalletBalance(returnedBalance.toFixed(3))
    }
    fetchBalances()
  }, [balance, ethBalance, walletAddress, walletBalance])

  useEffect(() => {
    const legacyAmount = Number(legacyBalance)
    const vnlAmount =
      (Number(walletVnlBalance) > 0 || Number(activeVnlBalance) > 0) &&
      Number(walletVnlBalance) !== Number(activeVnlBalance)
        ? Number(activeVnlBalance)
        : Number(walletVnlBalance)
    setWalletVnlBalance((legacyAmount + vnlAmount).toFixed(1))
  }, [legacyBalance, walletVnlBalance, activeVnlBalance])

  return !walletAddress && !account ? (
    <WalletConnectButton />
  ) : (
    <ButtonGroup grow={grow}>
      <Button
        onClick={() => {
          legacyBalance !== '0' &&
            setTokenConversionState(ConversionState.LOADING)
          setWalletModalOpen(!walletModalOpen)
        }}
        size={ButtonSize.SMALL}
        rounded={Rounding.LEFT}
        color={ButtonColor.TRANSPARENT}
        bordered
        noRightBorder
        grow={grow}
        opacity={legacyBalance !== '0' ? Opacity.SEETHROUGH : undefined}
        title={
          legacyBalance !== '0'
            ? "You've got unconverted v1.0 balances!"
            : undefined
        }
      >
        {walletVnlBalance} VNL
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

export const MobileWalletFloater: React.FC<SmallWalletInfoProps> = (
  props: SmallWalletInfoProps,
) => {
  return (
    <>
      <BottomFloater>
        <div className='walletInfoWrapper'>
          <SmallWalletInfo grow {...props} />
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
