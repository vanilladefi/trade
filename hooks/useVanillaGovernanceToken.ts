import { Token, TokenAmount } from '@uniswap/sdk-core'
import ERC20 from '@uniswap/v2-periphery/build/ERC20.json'
import { BigNumber, constants } from 'ethers'
import { Interface, Result } from 'ethers/lib/utils'
import { getTheGraphClient, UniswapVersion, v2, v3 } from 'lib/graphql'
import { isAddress, tokenListChainId, weth } from 'lib/tokens'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState } from 'state/wallet'
import VanillaV1Token02 from 'types/abis/VanillaV1Token02.json'
import { VanillaVersion } from 'types/general'
import { getVnlTokenAddress } from 'utils/config'
import { useContract, useTokenContract } from './useContract'
import useTokenBalance from './useTokenBalance'
import useWalletAddress from './useWalletAddress'

function useVanillaGovernanceToken(version: VanillaVersion): {
  address: string
  decimals: number
  balance: string
  price: string
  userMintedTotal: string
} {
  const provider = useRecoilValue(providerState)
  const decimals = 12

  const addresses = useMemo(
    () => [
      isAddress(getVnlTokenAddress(VanillaVersion.V1_0)) ||
        getVnlTokenAddress(VanillaVersion.V1_0),
      isAddress(getVnlTokenAddress(VanillaVersion.V1_1)) ||
        getVnlTokenAddress(VanillaVersion.V1_1),
    ],
    [],
  )

  const [uniswapVersion, setUniswapVersion] = useState<UniswapVersion | null>(
    null,
  )
  const [versionAddress, setVersionAddress] = useState<string | null>(null)
  const [vnlEthPrice, setVnlEthPrice] = useState('0')
  const { long: userAddress } = useWalletAddress()
  const [mints, setMints] = useState<Array<BigNumber>>()

  const contract1 = useTokenContract(addresses[0])
  const contract2 = useContract(addresses[1], VanillaV1Token02.abi)
  const { formatted: vnlBalance } = useTokenBalance(versionAddress, decimals)

  const userMintedTotal = useCallback(() => {
    if (versionAddress) {
      const bigSum: BigNumber | undefined =
        mints && mints.length
          ? mints.reduce((accumulator, current) => accumulator.add(current))
          : BigNumber.from('0')
      if (bigSum) {
        const token = new Token(tokenListChainId, versionAddress, decimals)
        const tokenAmount = new TokenAmount(token, bigSum.toString())
        return tokenAmount.toSignificant()
      }
    } else {
      return '0'
    }
  }, [mints, versionAddress])

  useEffect(() => {
    const getMints = async () => {
      if (contract1 && contract2 && provider && isAddress(userAddress)) {
        const ercInterface = new Interface(ERC20.abi)
        const events =
          version === VanillaVersion.V1_0
            ? contract1?.filters.Transfer(constants.AddressZero, userAddress)
            : contract2?.filters.Transfer(constants.AddressZero, userAddress)
        try {
          const blockNumber = await provider.getBlockNumber()
          const logs = await provider.getLogs({
            fromBlock: 0,
            toBlock: blockNumber,
            topics: events.topics,
          })
          const mintEvents: BigNumber[] = logs.map((log) => {
            const { value }: Result = ercInterface.decodeEventLog(
              'Transfer',
              log.data,
            )
            return value
          })
          setMints(mintEvents)
        } catch (e) {
          console.error(e)
          setMints([BigNumber.from('0')])
        }
      }
    }
    getMints()
  }, [contract1, contract2, provider, userAddress, version])

  useEffect(() => {
    if (versionAddress && uniswapVersion) {
      const getTokenPrice = async () => {
        const variables = {
          weth: weth.address.toLowerCase(),
          tokenAddresses: [versionAddress.toLowerCase()],
        }
        const { http } = getTheGraphClient(uniswapVersion)
        if (http) {
          const response = await http.request(
            uniswapVersion === UniswapVersion.v2
              ? v2.TokenInfoQuery
              : v3.TokenInfoQuery,
            variables,
          )
          const data = [...response?.tokensAB, ...response?.tokensBA]
          data[0] && setVnlEthPrice(data[0].price)
        }
      }
      getTokenPrice()
    }
  }, [uniswapVersion, version, versionAddress])

  useEffect(() => {
    setVersionAddress(
      version === VanillaVersion.V1_0 ? addresses[0] : addresses[1] || '',
    )
    setUniswapVersion(
      version === VanillaVersion.V1_0 ? UniswapVersion.v2 : UniswapVersion.v3,
    )
  }, [addresses, version])

  return {
    address: versionAddress || '',
    decimals: 12,
    balance: vnlBalance !== '' ? vnlBalance : '0',
    price: vnlEthPrice,
    userMintedTotal: userMintedTotal() || '0',
  }
}

export default useVanillaGovernanceToken
