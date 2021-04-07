import { Token, TokenAmount } from '@uniswap/sdk'
import ERC20 from '@uniswap/v2-periphery/build/ERC20.json'
import { BigNumber, constants } from 'ethers'
import { Interface, isAddress, Result } from 'ethers/lib/utils'
import { thegraphClient, TokenInfoQuery } from 'lib/graphql'
import { tokenListChainId, weth } from 'lib/tokens'
import { getVnlTokenAddress } from 'lib/vanilla'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState } from 'state/wallet'
import { useTokenContract } from './useContract'
import useTokenBalance from './useTokenBalance'
import useWalletAddress from './useWalletAddress'

function useVanillaGovernanceToken(): {
  address: string
  decimals: number
  balance: string
  price: string
  userMintedTotal: string
} {
  const provider = useRecoilValue(providerState)
  const decimals = 12

  const [vnlTokenAddress, setVnlTokenAddress] = useState('')
  const [vnlEthPrice, setVnlEthPrice] = useState('0')
  const { long: userAddress } = useWalletAddress()
  const [mints, setMints] = useState<Array<BigNumber>>()

  const contract = useTokenContract(vnlTokenAddress)
  const { formatted: vnlBalance } = useTokenBalance(vnlTokenAddress, decimals)

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
            .catch((e) => {
              console.error(e)
              setMints([BigNumber.from('0')])
            })
        })
      }
    }
    getMints()
  }, [contract, provider, userAddress])

  useEffect(() => {
    provider &&
      getVnlTokenAddress(provider).then(
        (address) => vnlTokenAddress === '' && setVnlTokenAddress(address),
      )
  }, [provider, vnlTokenAddress])

  useEffect(() => {
    const getTokenPrice = async () => {
      if (isAddress(vnlTokenAddress)) {
        const variables = {
          weth: weth.address.toLowerCase(),
          tokenAddresses: [vnlTokenAddress.toLowerCase()],
        }
        const response = await thegraphClient.request(TokenInfoQuery, variables)
        const data = [...response?.tokensAB, ...response?.tokensBA]
        setVnlEthPrice(data[0].price)
      }
    }
    getTokenPrice()
  }, [vnlTokenAddress])

  return useMemo(() => {
    return {
      address: vnlTokenAddress,
      decimals: 12,
      balance: vnlBalance !== '' ? vnlBalance : '0',
      price: vnlEthPrice,
      userMintedTotal: userMintedTotal(),
    }
  }, [userMintedTotal, vnlBalance, vnlEthPrice, vnlTokenAddress])
}

export default useVanillaGovernanceToken
