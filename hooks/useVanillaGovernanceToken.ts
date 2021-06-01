import { Token, TokenAmount } from '@uniswap/sdk-core'
import ERC20 from '@uniswap/v2-periphery/build/ERC20.json'
import { BigNumber, constants } from 'ethers'
import { Interface, isAddress, Result } from 'ethers/lib/utils'
import { getTheGraphClient, UniswapVersion, v2 } from 'lib/graphql'
import { tokenListChainId, weth } from 'lib/tokens'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState } from 'state/wallet'
import { VNLTokenAddress } from 'utils/config'
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

  const [vnlEthPrice, setVnlEthPrice] = useState('0')
  const { long: userAddress } = useWalletAddress()
  const [mints, setMints] = useState<Array<BigNumber>>()

  const contract = useTokenContract(VNLTokenAddress)
  const { formatted: vnlBalance } = useTokenBalance(VNLTokenAddress, decimals)

  const userMintedTotal = useCallback(() => {
    const bigSum: BigNumber | undefined =
      mints && mints.length
        ? mints.reduce((accumulator, current) => accumulator.add(current))
        : BigNumber.from('0')
    if (bigSum && VNLTokenAddress) {
      const token = new Token(tokenListChainId, VNLTokenAddress, decimals)
      const tokenAmount = new TokenAmount(token, bigSum.toString())
      return tokenAmount.toSignificant()
    } else {
      return '0'
    }
  }, [mints])

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
    const getTokenPrice = async () => {
      if (isAddress(VNLTokenAddress)) {
        const variables = {
          weth: weth.address.toLowerCase(),
          tokenAddresses: [VNLTokenAddress.toLowerCase()],
        }
        const { http } = getTheGraphClient(UniswapVersion.v2)
        if (http) {
          const response = await http.request(v2.TokenInfoQuery, variables)
          const data = [...response?.tokensAB, ...response?.tokensBA]
          setVnlEthPrice(data[0].price)
        }
      }
    }
    getTokenPrice()
  }, [])

  return useMemo(() => {
    return {
      address: VNLTokenAddress,
      decimals: 12,
      balance: vnlBalance !== '' ? vnlBalance : '0',
      price: vnlEthPrice,
      userMintedTotal: userMintedTotal(),
    }
  }, [userMintedTotal, vnlBalance, vnlEthPrice])
}

export default useVanillaGovernanceToken
