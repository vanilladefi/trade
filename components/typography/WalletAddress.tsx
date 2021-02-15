import React, { useMemo } from 'react'
import { Wallet } from 'use-wallet'

type Props = {
  wallet: Wallet<unknown>
}

const WalletAddress = ({ wallet }: Props): JSX.Element => {
  const walletAddress = useMemo(() => {
    const long = wallet.account || ''
    const short = wallet.account
      ? `${wallet.account.substring(0, 6)}...${wallet.account.substring(
          wallet.account.length - 4,
        )}`
      : ''
    return { long, short }
  }, [wallet.account])
  return <span title={walletAddress.long}>{walletAddress.short}</span>
}

export default WalletAddress
