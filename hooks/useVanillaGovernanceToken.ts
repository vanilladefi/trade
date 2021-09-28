import { Token, TokenAmount } from '@uniswap/sdk-core'
import { BigNumber } from 'ethers'
import { getTheGraphClient, v2 } from 'lib/graphql'
import { isAddress, tokenListChainId, weth } from 'lib/tokens'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { UniswapVersion, VanillaVersion } from 'types/general'
import { getVnlTokenAddress, vnlDecimals } from 'utils/config/vanilla'
import useTokenBalance from './useTokenBalance'
import useWalletAddress from './useWalletAddress'

function useVanillaGovernanceToken(version: VanillaVersion): {
  address: string
  decimals: number
  balance: string
  balanceRaw: BigNumber
  getTokenAmount: () => TokenAmount | undefined
  price: string
} {
  const addresses = useMemo(
    () => [
      isAddress(getVnlTokenAddress(VanillaVersion.V1_0)) ||
        getVnlTokenAddress(VanillaVersion.V1_0),
      isAddress(getVnlTokenAddress(VanillaVersion.V1_1)) ||
        getVnlTokenAddress(VanillaVersion.V1_1),
    ],
    [],
  )

  const { long: walletAddress } = useWalletAddress()

  const [uniswapVersion, setUniswapVersion] = useState<UniswapVersion | null>(
    null,
  )
  const [versionAddress, setVersionAddress] = useState<string | null>(null)
  const [vnlEthPrice, setVnlEthPrice] = useState('0')
  const { formatted: vnlBalance, raw: vnlBalanceRaw } = useTokenBalance(
    walletAddress,
    versionAddress,
    vnlDecimals,
  )

  const getTokenAmount = useCallback(() => {
    if (versionAddress && isAddress(versionAddress)) {
      const token = new Token(
        tokenListChainId,
        versionAddress || '',
        vnlDecimals,
      )
      const tokenAmount = new TokenAmount(token, vnlBalanceRaw.toString())
      return tokenAmount
    }
  }, [versionAddress, vnlBalanceRaw])

  useEffect(() => {
    if (versionAddress && uniswapVersion) {
      const getTokenPrice = async () => {
        const variables = {
          weth: weth.address.toLowerCase(),
          tokenAddresses: [versionAddress.toLowerCase()],
        }
        // TODO: Change this to Uniswap.v3 when VNL gets liquidity there
        const { http } = getTheGraphClient(UniswapVersion.v2)
        if (http) {
          const response = await http.request(v2.TokenInfoQuery, variables)
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
    decimals: vnlDecimals,
    balance: vnlBalance !== '' ? vnlBalance : '0',
    balanceRaw: vnlBalanceRaw,
    getTokenAmount: getTokenAmount,
    price: vnlEthPrice,
  }
}

export default useVanillaGovernanceToken
