import { Token, TokenAmount } from '@uniswap/sdk-core'
import { BigNumber, Contract, Signer } from 'ethers'
import { isAddress, tokenListChainId, weth } from 'lib/tokens'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { currentBlockNumberState } from 'state/meta'
import { signerState } from 'state/wallet'
import { useTokenContract } from './useContract'
import useWalletAddress from './useWalletAddress'

function useTokenBalance(
  tokenAddress?: string | null,
  decimals?: string | number | null,
  wethAsEth?: boolean,
): { formatted: string; raw: BigNumber; decimals: number } {
  const signer = useRecoilValue(signerState)
  const blockNumber = useRecoilValue(currentBlockNumberState)

  const [raw, setRaw] = useState(BigNumber.from('0'))
  const [formatted, setFormatted] = useState('')

  const { long: userAddress } = useWalletAddress()
  const contract = useTokenContract(tokenAddress || '')

  const getRawBalance = useCallback(
    async (tokenAddress: string, contract: Contract, signer: Signer) => {
      let raw: BigNumber = BigNumber.from('0')
      if (
        wethAsEth &&
        tokenAddress.toLowerCase() === weth.address.toLowerCase() &&
        signer
      ) {
        raw = await signer.getBalance()
      } else {
        raw = await contract.balanceOf(userAddress)
      }
      return raw
    },
    [userAddress, wethAsEth],
  )

  useEffect(() => {
    const getBalances = async () => {
      if (
        tokenAddress &&
        isAddress(tokenAddress) &&
        isAddress(userAddress) &&
        decimals &&
        contract &&
        signer
      ) {
        try {
          // Get raw BigNumber balance. Interpret wETH as ETH if specified.
          const raw: BigNumber = await getRawBalance(
            tokenAddress,
            contract,
            signer,
          )
          // Make sure "decimals" is an integer
          const parsedDecimals = parseInt(decimals.toString())

          // Construct token amounts
          const token = new Token(
            tokenListChainId,
            tokenAddress,
            parsedDecimals,
          )
          const formatted = new TokenAmount(token, raw.toString())

          setRaw(raw)
          setFormatted(formatted.toSignificant())
        } catch (e) {
          console.error(e)
        }
      }
    }
    getBalances()
    return () => {
      setRaw(BigNumber.from('0'))
      setFormatted('')
    }
  }, [
    contract,
    decimals,
    getRawBalance,
    signer,
    tokenAddress,
    userAddress,
    wethAsEth,
    blockNumber,
  ])

  return {
    formatted: formatted,
    raw: raw,
    decimals: parseInt(decimals?.toString() || '18'),
  }
}

export default useTokenBalance
