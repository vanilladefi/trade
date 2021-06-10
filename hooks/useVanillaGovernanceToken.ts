import { Token, TokenAmount } from '@uniswap/sdk-core'
import ERC20 from '@uniswap/v2-periphery/build/ERC20.json'
import { BigNumber, constants } from 'ethers'
import { Interface, isAddress, Result } from 'ethers/lib/utils'
import { getTheGraphClient, UniswapVersion, v2, v3 } from 'lib/graphql'
import { tokenListChainId, weth } from 'lib/tokens'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState } from 'state/wallet'
import VanillaV1Token02 from 'types/abis/VanillaV1Token02.json'
import { VanillaVersion } from 'types/general'
import { getVnlTokenAddress } from 'utils/config'
import { useContract, useTokenContract } from './useContract'
import useTokenBalance from './useTokenBalance'
import useWalletAddress from './useWalletAddress'

function useVanillaGovernanceToken(
  version: VanillaVersion,
): {
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

  const contract1 = useTokenContract(getVnlTokenAddress(VanillaVersion.V1_0))
  const contract2 = useContract(
    getVnlTokenAddress(VanillaVersion.V1_1),
    VanillaV1Token02.abi,
  )
  const { formatted: vnlBalance } = useTokenBalance(
    getVnlTokenAddress(version),
    decimals,
  )

  const userMintedTotal = useCallback(() => {
    const bigSum: BigNumber | undefined =
      mints && mints.length
        ? mints.reduce((accumulator, current) => accumulator.add(current))
        : BigNumber.from('0')
    if (bigSum && getVnlTokenAddress(version)) {
      const token = new Token(
        tokenListChainId,
        getVnlTokenAddress(version),
        decimals,
      )
      const tokenAmount = new TokenAmount(token, bigSum.toString())
      return tokenAmount.toSignificant()
    } else {
      return '0'
    }
  }, [mints, version])

  useEffect(() => {
    const getMints = async () => {
      if (contract1 && contract2 && provider && isAddress(userAddress)) {
        const ercInterface = new Interface(ERC20.abi)
        const events =
          version === VanillaVersion.V1_0
            ? contract1?.filters.Transfer(constants.AddressZero, userAddress)
            : contract2?.filters.Transfer(constants.AddressZero, userAddress)
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
  }, [contract1, contract2, provider, userAddress, version])

  useEffect(() => {
    const getTokenPrice = async () => {
      if (isAddress(getVnlTokenAddress(version))) {
        const variables = {
          weth: weth.address.toLowerCase(),
          tokenAddresses: [getVnlTokenAddress(version).toLowerCase()],
        }
        const { http } = getTheGraphClient(
          version === VanillaVersion.V1_0
            ? UniswapVersion.v2
            : UniswapVersion.v3,
        )
        if (http) {
          const response = await http.request(
            version === VanillaVersion.V1_0
              ? v2.TokenInfoQuery
              : v3.TokenInfoQuery,
            variables,
          )
          const data = [...response?.tokensAB, ...response?.tokensBA]
          data[0] && setVnlEthPrice(data[0].price)
        }
      }
    }
    getTokenPrice()
  }, [version])

  return useMemo(() => {
    return {
      address: getVnlTokenAddress(version),
      decimals: 12,
      balance: vnlBalance !== '' ? vnlBalance : '0',
      price: vnlEthPrice,
      userMintedTotal: userMintedTotal(),
    }
  }, [userMintedTotal, version, vnlBalance, vnlEthPrice])
}

export default useVanillaGovernanceToken
