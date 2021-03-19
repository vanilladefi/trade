import { Token, TokenAmount } from '@uniswap/sdk'
import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { tokenListChainId } from 'lib/tokens'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { userTokensState } from 'state/tokens'
import { useTokenContract } from './useContract'
import useWalletAddress from './useWalletAddress'

function useTokenBalance(
  tokenAddress?: string | null,
  decimals?: string | number | null,
): { formatted: string; raw: BigNumber; decimals: number } {
  const userTokens = useRecoilValue(userTokensState)

  const [raw, setRaw] = useState(BigNumber.from('0'))
  const [formatted, setFormatted] = useState('')
  const [updatedDecimals, setDecimals] = useState(18)

  const { long: userAddress } = useWalletAddress()
  const contract = useTokenContract(tokenAddress || '')

  const getBalances = useCallback(async () => {
    if (tokenAddress) {
      const token = userTokens?.find(
        (token) => token.address.toLowerCase() === tokenAddress.toLowerCase(),
      )

      if (token) {
        const ownedRaw: BigNumber =
          token && token.ownedRaw
            ? parseUnits(token.ownedRaw, token?.decimals)
            : BigNumber.from('0')
        setFormatted(token?.owned ?? '0')
        setRaw(ownedRaw)
        setDecimals(token.decimals)
      } else {
        if (decimals && userAddress) {
          const parsedDecimals = parseInt(decimals.toString())
          const token = new Token(
            tokenListChainId,
            tokenAddress,
            parsedDecimals,
          )
          const raw =
            contract && userAddress
              ? await contract.balanceOf(userAddress)
              : '0'
          const formatted = new TokenAmount(token, raw.toString())
          setRaw(raw)
          setFormatted(formatted.toSignificant())
          setDecimals(parsedDecimals)
        }
      }
    }
  }, [contract, decimals, tokenAddress, userAddress, userTokens])

  useEffect(() => {
    getBalances()
    return () => {
      setRaw(BigNumber.from('0'))
      setFormatted('')
    }
  }, [getBalances])

  return useMemo(() => {
    return { formatted: formatted, raw: raw, decimals: updatedDecimals }
  }, [formatted, raw, updatedDecimals])
}

export default useTokenBalance
