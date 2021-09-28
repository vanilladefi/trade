import { Token, TokenAmount } from '@uniswap/sdk-core'
import { BigNumber, Contract, providers, Signer } from 'ethers'
import { isAddress, tokenListChainId, weth } from 'lib/tokens'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { currentBlockNumberState } from 'state/meta'
import { providerState, signerState } from 'state/wallet'
import { useTokenContract } from './useContract'

function useTokenBalance(
  walletAddress: string,
  tokenAddress?: string | null,
  decimals?: string | number | null,
  wethAsEth?: boolean,
): { formatted: string; raw: BigNumber; decimals: number } {
  const signer = useRecoilValue(signerState)
  const provider = useRecoilValue(providerState)
  const blockNumber = useRecoilValue(currentBlockNumberState)

  const [raw, setRaw] = useState(BigNumber.from('0'))
  const [formatted, setFormatted] = useState('')

  const contract = useTokenContract(tokenAddress || '')

  const getRawBalance = useCallback(
    async (
      tokenAddress: string,
      contract: Contract,
      signerOrProvider: Signer | providers.Provider,
    ) => {
      let raw: BigNumber = BigNumber.from('0')
      if (
        wethAsEth &&
        tokenAddress.toLowerCase() === weth.address.toLowerCase() &&
        signerOrProvider
      ) {
        raw = await signerOrProvider.getBalance(walletAddress, 'latest')
      } else {
        raw = await contract.balanceOf(walletAddress)
      }
      return raw
    },
    [walletAddress, wethAsEth],
  )

  useEffect(() => {
    const getBalances = async () => {
      const signerOrProvider = signer || provider
      if (
        tokenAddress &&
        isAddress(tokenAddress) &&
        isAddress(walletAddress) &&
        decimals &&
        contract &&
        signerOrProvider
      ) {
        try {
          // Get raw BigNumber balance. Interpret wETH as ETH if specified.
          const raw: BigNumber = await getRawBalance(
            tokenAddress,
            contract,
            signerOrProvider,
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
    walletAddress,
    wethAsEth,
    blockNumber,
    provider,
  ])

  return {
    formatted: formatted,
    raw: raw,
    decimals: parseInt(decimals?.toString() || '18'),
  }
}

export default useTokenBalance
