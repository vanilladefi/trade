import { Contract } from '@ethersproject/contracts'
import ERC20 from '@uniswap/v2-periphery/build/ERC20.json'
import { getContract } from 'lib/tokens'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState } from 'state/wallet'
import ABI from 'types/abis'

export function useContract(
  address: string | undefined,
  ABI: ABI,
): Contract | null {
  const provider = useRecoilValue(providerState)

  return useMemo(() => {
    if (!address || !ABI || !provider) return null
    try {
      return getContract(address, ABI, provider)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, provider])
}

export function useTokenContract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, ERC20.abi)
}
