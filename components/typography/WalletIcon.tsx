import dynamic from 'next/dynamic'
import React from 'react'
import { Connectors } from 'use-wallet'

const Image = dynamic(import('next/image'))

type Props = {
  walletType: keyof Connectors
  width?: string
  height?: string
}

const matchWalletTypeToIcon = (walletType: keyof Connectors): string => {
  switch (walletType) {
    case 'injected': {
      return '/images/wallets/metamask.png'
    }
    case 'walletconnect': {
      return '/images/wallets/walletConnectIcon.svg'
    }
    case 'ledger': {
      return '/images/wallets/ledger.svg'
    }
    default: {
      return ''
    }
  }
}

const WalletIcon: React.FC<Props> = ({
  walletType,
  height = '22px',
  width = '22px',
}: Props) => {
  const iconSrc = matchWalletTypeToIcon(walletType)
  return iconSrc !== '' ? (
    <Image src={iconSrc} height={height} width={width} layout='fixed' />
  ) : (
    <></>
  )
}

export default WalletIcon
