import {
  Token as UniswapToken,
  TokenAmount,
  TradeType,
} from '@uniswap/sdk-core'
import { chainId, vnlPools, weth } from '@vanilladefi/sdk'
import { isAddress } from '@vanilladefi/sdk/tokens'
import { BigNumber } from 'ethers'
import { constructTrade } from 'lib/uniswap/v3/trade'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { PrerenderProps } from 'types/content'
import { UniswapVersion, VanillaVersion } from 'types/general'
import { Token } from 'types/trade'
import { defaultProvider } from 'utils/config'
import { getVnlTokenAddress, vnlDecimals } from 'utils/config/vanilla'
import useTokenBalance from './useTokenBalance'
import useWalletAddress from './useWalletAddress'

function useVanillaGovernanceToken(
  version: VanillaVersion,
  prerenderProps?: PrerenderProps,
): {
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

  const { long: walletAddress } = useWalletAddress(prerenderProps)

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
      const token = new UniswapToken(chainId, versionAddress || '', vnlDecimals)
      const tokenAmount = new TokenAmount(token, vnlBalanceRaw.toString())
      return tokenAmount
    }
  }, [versionAddress, vnlBalanceRaw])

  // TODO: Separate as getVnlPrice(vanillaVersion) under @vanilladefi/sdk -> SDK
  useEffect(() => {
    if (versionAddress && uniswapVersion) {
      const getTokenPrice = async () => {
        const vanillaToken: Token = {
          chainId: chainId.toString(),
          address: versionAddress,
          decimals: vnlDecimals.toString(),
          pairId: vnlPools.ETH,
          logoColor: '',
          symbol: 'VNL',
        }
        const trade = await constructTrade(
          defaultProvider,
          '1000',
          weth,
          vanillaToken,
          TradeType.EXACT_INPUT,
        )
        if (trade?.executionPrice) {
          setVnlEthPrice(trade.executionPrice.toSignificant())
        }
      }
      getTokenPrice()
    }
  }, [
    prerenderProps?.vnlBalance,
    uniswapVersion,
    version,
    versionAddress,
    vnlBalance,
  ])

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
