import Image from 'next/image'
import React from 'react'
import { Connectors } from 'use-wallet'

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
    default: {
      return ''
    }
  }
}

const WalletIcon = ({
  walletType,
  height = '22px',
  width = '22px',
}: Props): JSX.Element => {
  const iconSrc = matchWalletTypeToIcon(walletType)
  return iconSrc !== '' ? (
    <Image src={iconSrc} height={height} width={width} layout='fixed' />
  ) : (
    <></>
  )
}

export default WalletIcon
