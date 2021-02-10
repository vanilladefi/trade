import uniswapTokens from '@uniswap/default-token-list'
import { constants, ethers, providers } from 'ethers'
import { UniSwapToken } from 'types/trade'
import vanillaABI from 'types/vanillaRouter'
import { chainId, vanillaRouterAddress } from 'utils/config'

type TradeProps = {
  tokenAddress: string
  amountETH: number
  amount?: number
  provider?: providers.JsonRpcProvider
  signer?: providers.JsonRpcSigner
}

export const WETH: UniSwapToken = uniswapTokens?.tokens.find(
  (token) => token.chainId === chainId && token.symbol === 'WETH',
) || {
  name: 'Wrapped Ether',
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  symbol: 'WETH',
  decimals: 18,
  chainId: 1,
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
}

export const buy = async ({
  tokenAddress,
  amountETH,
  signer,
}: TradeProps): Promise<string> => {
  const vanillaRouter = new ethers.Contract(
    vanillaRouterAddress,
    JSON.stringify(vanillaABI),
    signer,
  )
  const receipt = await vanillaRouter.buy(
    tokenAddress,
    12,
    constants.MaxUint256,
    { value: amountETH },
  )
  return receipt
}

export const sell = async ({
  tokenAddress,
  amount,
  provider,
}: TradeProps): Promise<string> => {
  const vanillaRouter = new ethers.Contract(
    vanillaRouterAddress,
    JSON.stringify(vanillaABI),
    provider,
  )
  const receipt = await vanillaRouter.sell(
    tokenAddress,
    493,
    amount,
    constants.MaxUint256,
  )
  return receipt
}
