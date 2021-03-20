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
    if (tokenAddress) {
      // Check balances from owned tokens first
      const token = userTokens?.find(
        (token) => token.address.toLowerCase() === tokenAddress.toLowerCase(),
      )

      // Show cached balance if possible, revert to new balance query if not
      if (token) {
        const ownedRaw: BigNumber =
          token && token.ownedRaw
            ? parseUnits(token.ownedRaw, token?.decimals)
            : BigNumber.from('0')
        setFormatted(token?.owned ?? '0')
        setRaw(ownedRaw)
        setDecimals(token.decimals)
      } else {
        if (decimals && userAddress && contract) {
          // Get raw BigNumber balance. Interpret wETH as ETH if specified.
          let raw: BigNumber = BigNumber.from('0')
          if (
            wethAsEth &&
            tokenAddress.toLowerCase() === weth.address.toLowerCase() &&
            signer
          ) {
            raw = await signer?.getBalance()
          } else {
            raw = await contract.balanceOf(userAddress)
          }
          // Make sure "decimals" is an integer
          const parsedDecimals = parseInt(decimals.toString())
          const token = new Token(
            tokenListChainId,
            tokenAddress,
            parsedDecimals,
          )
          const formatted = new TokenAmount(token, raw.toString())

          setRaw(raw)
          setFormatted(formatted.toSignificant())
          setDecimals(parsedDecimals)
        }
      }
    }
  }, [
    contract,
    decimals,
    signer,
    tokenAddress,
    userAddress,
    userTokens,
    wethAsEth,
  ])

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
