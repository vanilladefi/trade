import { useMemo } from 'react'
import { useWallet } from 'use-wallet'

function useWalletAddress(): { short: string; long: string } {
  const { account } = useWallet()
  return useMemo(() => {
    const long = account || ''
    const short = account
      ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
      : ''
    return { long, short }
  }, [account])
}

export default useWalletAddress
