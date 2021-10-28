import { isAddress } from '@vanilladefi/sdk/tokens'
import { useEffect, useMemo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { signerState, walletAddressState } from 'state/wallet'
import { PrerenderProps } from 'types/content'

function useWalletAddress(prerenderProps?: PrerenderProps): {
  short: string
  long: string
} {
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
    let long: string
    if (
      prerenderProps?.walletAddress &&
      isAddress(prerenderProps?.walletAddress)
    ) {
      long =
        (prerenderProps?.walletAddress &&
          isAddress(prerenderProps?.walletAddress)) ||
        ''
    } else {
      long = walletAddress
    }
    const short = long
      ? `${long.substring(0, 6)}...${long.substring(long.length - 4)}`
      : ''
    return { short, long }
  }, [prerenderProps?.walletAddress, walletAddress])
}

export default useWalletAddress
