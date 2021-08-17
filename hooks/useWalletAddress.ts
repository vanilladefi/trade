import { isAddress } from 'lib/tokens'
import { useMemo } from 'react'
import { useWallet } from 'use-wallet'

function useWalletAddress(): { short: string; long: string } {
  const { account } = useWallet()
  return useMemo(() => {
    const checkSummedAddress = isAddress(account)
    let [long, short] = ['', '']
    if (checkSummedAddress) {
      long = checkSummedAddress || ''
      short = checkSummedAddress
        ? `${checkSummedAddress.substring(
            0,
            6,
          )}...${checkSummedAddress.substring(checkSummedAddress.length - 4)}`
        : ''
    }
    return { long, short }
  }, [account])
}

export default useWalletAddress
