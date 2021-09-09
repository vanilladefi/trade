import { isAddress } from 'lib/tokens'
import { useEffect, useMemo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { signerState, walletAddressState } from 'state/wallet'

function useWalletAddress(): { short: string; long: string } {
  const signer = useRecoilValue(signerState)
  const [walletAddress, setWalletAddress] = useRecoilState(walletAddressState)
  useEffect(() => {
    const getWalletAddress = async () => {
      if (signer) {
        const checkSummedAddress = isAddress(await signer.getAddress())
        if (checkSummedAddress) {
          setWalletAddress(checkSummedAddress)
        }
      }
    }
    getWalletAddress()
  }, [setWalletAddress, signer])
  return useMemo(() => {
    const short = walletAddress
      ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(
          walletAddress.length - 4,
        )}`
      : ''
    return { short: short, long: walletAddress }
  }, [walletAddress])
}

export default useWalletAddress
