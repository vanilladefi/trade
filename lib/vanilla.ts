import { BigNumber, ethers, providers } from 'ethers'
import vanillaRouter from 'types/abis/vanillaRouter.json'
import { UniSwapToken } from 'types/trade'
import { vanillaRouterAddress } from 'utils/config'
import { tryParseAmount } from './uniswap/trade'

export const getVnlTokenAddress = async (
  provider: providers.JsonRpcProvider,
): Promise<string> => {
  try {
    const router = new ethers.Contract(
      vanillaRouterAddress,
      JSON.stringify(vanillaRouter.abi),
      provider,
    )
    const vnlTokenAddress = await router.vnlContract()
    return vnlTokenAddress
  } catch (e) {
    return ''
  }
}

export interface TokenPriceResponse {
  ethSum: BigNumber
  latestBlock: BigNumber
  tokenSum: BigNumber
  weightedBlockSum: BigNumber
}

export interface RewardResponse {
  profitablePrice: BigNumber
  avgBlock: BigNumber
  htrs: BigNumber
  vpc: BigNumber
  reward: BigNumber
}

export const estimateReward = async (
  provider: providers.AlchemyWebSocketProvider | providers.JsonRpcProvider,
  userAddress: string,
  tokenSold: UniSwapToken,
  tokenReceived: UniSwapToken,
  amountSold: string,
  amountReceived: string,
): Promise<RewardResponse | null> => {
  const [parsedAmountSold, parsedAmountReceived] = [
    tryParseAmount(amountSold, tokenSold),
    tryParseAmount(amountReceived, tokenReceived),
  ]

  const router = new ethers.Contract(
    vanillaRouterAddress,
    JSON.stringify(vanillaRouter.abi),
    provider,
  )
  let reward: RewardResponse | null

  try {
    reward = await router.estimateReward(
      userAddress,
      tokenSold.address,
      parsedAmountReceived?.raw.toString(),
      parsedAmountSold?.raw.toString(),
    )
  } catch (e) {
    reward = null
  }

  return reward
}

export const getPriceData = async (
  provider: providers.AlchemyWebSocketProvider | providers.JsonRpcProvider,
  userAddress: string,
  tokenAddress: string,
): Promise<TokenPriceResponse | null> => {
  const router = new ethers.Contract(
    vanillaRouterAddress,
    JSON.stringify(vanillaRouter.abi),
    provider,
  )
  let priceData: TokenPriceResponse | null

  try {
    priceData = await router.tokenPriceData(userAddress, tokenAddress)
  } catch (e) {
    priceData = null
  }

  return priceData
}

export const getEpoch = async (
  provider: providers.AlchemyWebSocketProvider | providers.JsonRpcProvider,
): Promise<BigNumber | null> => {
  const router = new ethers.Contract(
    vanillaRouterAddress,
    JSON.stringify(vanillaRouter.abi),
    provider,
  )
  let epoch: BigNumber | null

  try {
    epoch = await router.epoch()
  } catch (e) {
    epoch = null
  }

  return epoch
}
