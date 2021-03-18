import { Token, TokenAmount } from '@uniswap/sdk'
import ERC20 from '@uniswap/v2-periphery/build/ERC20.json'
import { BigNumber, constants } from 'ethers'
import { Interface, isAddress, Result } from 'ethers/lib/utils'
import { tokenListChainId } from 'lib/tokens'
import { getVnlTokenAddress } from 'lib/vanilla'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState, signerState } from 'state/wallet'
import { useTokenContract } from './useContract'
import { useTokenBalance } from './useTokenBalance'
import useWalletAddress from './useWalletAddress'

function useVanillaGovernanceToken(): {
  address: string
  decimals: number
  balance: string
  userMintedTotal: string
} {
  const { long: userAddress } = useWalletAddress()
  const signer = useRecoilValue(signerState)
  const provider = useRecoilValue(providerState)
  const decimals = 12

  const [vnlTokenAddress, setVnlTokenAddress] = useState('')
  const [mints, setMints] = useState<Array<BigNumber>>()

  const contract = useTokenContract(vnlTokenAddress)
  const { formatted: vnlBalance } = useTokenBalance(
    vnlTokenAddress,
    decimals,
    userAddress,
  )

  const userMintedTotal = useCallback(() => {
    const bigSum: BigNumber | undefined =
      mints && mints.length
        ? mints.reduce((accumulator, current) => accumulator.add(current))
        : BigNumber.from('0')
    if (bigSum && vnlTokenAddress) {
      const token = new Token(tokenListChainId, vnlTokenAddress, decimals)
      const tokenAmount = new TokenAmount(token, bigSum.toString())
      return tokenAmount.toSignificant()
    } else {
      return '0'
    }
  }, [mints, vnlTokenAddress])

  useEffect(() => {
    const getMints = async () => {
      if (contract && provider && isAddress(userAddress)) {
        const ercInterface = new Interface(ERC20.abi)
        const events = contract?.filters.Transfer(
          constants.AddressZero,
          userAddress,
        )
        provider.getBlockNumber().then((blockNumber) => {
          provider
            .getLogs({
              fromBlock: 0,
              toBlock: blockNumber,
              topics: events.topics,
            })
            .then((logs) => {
              const mintEvents: BigNumber[] = logs.map((log) => {
                const { value }: Result = ercInterface.decodeEventLog(
                  'Transfer',
                  log.data,
                )
                return value
              })
              setMints(mintEvents)
            })
        })
      }
    }
    getMints()
  }, [contract, provider, userAddress])

  useEffect(() => {
    provider && getVnlTokenAddress(provider).then(setVnlTokenAddress)
  }, [provider, signer])

  return useMemo(() => {
    return {
      address: vnlTokenAddress,
      decimals: 12,
      balance: vnlBalance !== '' ? vnlBalance : '0',
      userMintedTotal: userMintedTotal(),
    }
  }, [userMintedTotal, vnlBalance, vnlTokenAddress])
}

export default useVanillaGovernanceToken
