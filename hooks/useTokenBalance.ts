import { Token, TokenAmount } from '@uniswap/sdk'
import { BigNumber } from 'ethers'
import { tokenListChainId } from 'lib/tokens'
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
      if (tokenAddress && decimals) {
        const parsedDecimals = parseInt(decimals.toString())
        const token = new Token(tokenListChainId, tokenAddress, parsedDecimals)
        const raw = contract && owner ? await contract.balanceOf(owner) : '0'
        const formatted = new TokenAmount(token, raw.toString())
        setRaw(raw)
        setFormatted(formatted.toSignificant())
      }
    },
    [contract, decimals, tokenAddress],
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
