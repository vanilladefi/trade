import { Contract } from '@ethersproject/contracts'
import ERC20 from '@uniswap/v2-periphery/build/ERC20.json'
import { getContract } from '@vanilladefi/sdk'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { signerState } from 'state/wallet'
import ABI from 'types/abis'
import { defaultProvider } from 'utils/config'

export function useContract(
  address: string | undefined,
  ABI: ABI,
): Contract | null {
  const signer = useRecoilValue(signerState)

  return useMemo(() => {
    if (!address || !ABI) return null
    try {
      return getContract(address, ABI, signer || defaultProvider)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, signer])
}

export function useTokenContract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, ERC20.abi)
}
