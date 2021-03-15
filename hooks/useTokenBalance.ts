import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState } from 'state/wallet'
import { useTokenContract } from './useContract'

export function useTokenBalance(
  tokenAddress?: string | null,
  decimals?: string | number | null,
  owner?: string | null,
): { raw: BigNumber; formatted: string } {
  const contract = useTokenContract(tokenAddress || '')
  const provider = useRecoilValue(providerState)

  const [raw, setRaw] = useState(BigNumber.from('0'))
  const [formatted, setFormatted] = useState('')

  const getBalance = useCallback(
    async (owner: string | null | undefined) => {
      const raw = contract
        ? owner
          ? await contract.balanceOf(owner)
          : '0'
        : (owner && (await provider?.getBalance(owner))) || '0'
      const formatted = formatUnits(raw.toString(), decimals || 18)
      setRaw(raw)
      setFormatted(formatted)
    },
    [contract, decimals, provider],
  )

  useEffect(() => {
    getBalance(owner)
    return () => {
      setRaw(BigNumber.from('0'))
      setFormatted('')
    }
  }, [contract, decimals, getBalance, owner, provider])

  return { raw, formatted }
}
