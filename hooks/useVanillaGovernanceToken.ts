import { Token, TokenAmount } from '@uniswap/sdk-core'
import { convertVanillaTokenToUniswapToken, vnl } from '@vanilladefi/sdk'
import { BigNumber, constants } from 'ethers'
import { UniswapVersion } from 'lib/graphql'
import { isAddress, tokenListChainId, weth } from 'lib/tokens'
import { getSpotPrice, vnlPools } from 'lib/uniswap/v3/spotPrice'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState } from 'state/wallet'
import VanillaV1Token02 from 'types/abis/VanillaV1Token02.json'
import { VanillaVersion } from 'types/general'
import { getVnlTokenAddress, vnlDecimals } from 'utils/config'
import { useContract, useTokenContract } from './useContract'
import useTokenBalance from './useTokenBalance'
import useWalletAddress from './useWalletAddress'

function useVanillaGovernanceToken(version: VanillaVersion): {
  address: string
  decimals: number
  balance: string
  balanceRaw: BigNumber
  getTokenAmount: () => TokenAmount | undefined
  price: string
  userMintedTotal: string
} {
  const provider = useRecoilValue(providerState)

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
  const { formatted: vnlBalance, raw: vnlBalanceRaw } = useTokenBalance(
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

  const userMintedTotal = useCallback(() => {
    if (versionAddress) {
      const bigSum: BigNumber | undefined =
        mints && mints.length
          ? mints.reduce((accumulator, current) => accumulator.add(current))
          : BigNumber.from('0')
      if (bigSum) {
        const token = new Token(tokenListChainId, versionAddress, vnlDecimals)
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
        const [contract, eventFilter] =
          version === VanillaVersion.V1_0
            ? [
                contract1,
                contract1.filters.Transfer(constants.AddressZero, userAddress),
              ]
            : [
                contract2,
                contract2.filters.Transfer(constants.AddressZero, userAddress),
              ]
        try {
          const blockNumber = await provider.getBlockNumber()
          const mintedValues = await contract
            .connect(provider)
            .queryFilter(eventFilter, 0, blockNumber)
            .then((events) => events.map((event) => event.args?.value))
          setMints(mintedValues)
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
        const price = getSpotPrice(
          vnlPools.ETH,
          convertVanillaTokenToUniswapToken(vnl),
          convertVanillaTokenToUniswapToken(weth),
          provider,
        )
        setVnlEthPrice(price[0])
        console.log(price)
      }
      getTokenPrice()
    }
  }, [provider, uniswapVersion, version, versionAddress])

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
    userMintedTotal: userMintedTotal() || '0',
  }
}

export default useVanillaGovernanceToken
