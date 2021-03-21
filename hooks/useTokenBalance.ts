import { Token, TokenAmount } from '@uniswap/sdk'
import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { tokenListChainId, weth } from 'lib/tokens'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { userTokensState } from 'state/tokens'
import { signerState } from 'state/wallet'
import { useTokenContract } from './useContract'
import useWalletAddress from './useWalletAddress'

function useTokenBalance(
  tokenAddress?: string | null,
  decimals?: string | number | null,
  wethAsEth?: boolean,
): { formatted: string; raw: BigNumber; decimals: number } {
  const userTokens = useRecoilValue(userTokensState)
  const signer = useRecoilValue(signerState)

  const [raw, setRaw] = useState(BigNumber.from('0'))
  const [formatted, setFormatted] = useState('')
  const [updatedDecimals, setDecimals] = useState(18)

  const { long: userAddress } = useWalletAddress()
  const contract = useTokenContract(tokenAddress || '')

  const getBalances = useCallback(async () => {
    const fetchRawBalance = async () => {
      let raw: BigNumber = BigNumber.from('0')
      if (
        wethAsEth &&
        tokenAddress &&
        tokenAddress.toLowerCase() === weth.address.toLowerCase() &&
        signer
      ) {
        raw = await signer?.getBalance()
      } else if (contract) {
        raw = await contract.balanceOf(userAddress)
      }
      return raw
    }

    if (tokenAddress) {
      // Check balances from owned tokens first
      const cachedToken =
        tokenAddress &&
        userTokens?.find(
          (token) => token.address.toLowerCase() === tokenAddress.toLowerCase(),
        )

      const cachedTokenOwnedRaw =
        cachedToken && cachedToken.ownedRaw
          ? parseUnits(cachedToken.ownedRaw, cachedToken?.decimals)
          : BigNumber.from('0')

      // Show cached balance if possible, revert to new balance query if not
      if (cachedToken && cachedToken instanceof Token) {
        if (cachedTokenOwnedRaw !== raw || raw.isZero()) {
          setFormatted(cachedToken?.owned ?? '0')
          setRaw(cachedTokenOwnedRaw)
          setDecimals(cachedToken.decimals)
        }
      } else {
        if (decimals && userAddress && contract) {
          // Get raw BigNumber balance. Interpret wETH as ETH if specified.
          const newRaw: BigNumber = await fetchRawBalance()
          // Make sure "decimals" is an integer
          const parsedDecimals = parseInt(decimals.toString())
          const token = new Token(
            tokenListChainId,
            tokenAddress,
            parsedDecimals,
          )
          const formatted = new TokenAmount(token, newRaw.toString())

          if (newRaw !== raw || raw.isZero()) {
            setRaw(newRaw)
            setFormatted(formatted.toSignificant())
            setDecimals(parsedDecimals)
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decimals, signer, tokenAddress, userAddress, wethAsEth])

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
