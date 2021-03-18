import { BigNumber, ethers, providers, Signer } from 'ethers'
import vanillaABI from 'types/abis/vanillaRouter'
import { UniSwapToken } from 'types/trade'
import { vanillaRouterAddress } from 'utils/config'
import { tryParseAmount } from './uniswap/trade'

export const getVnlTokenAddress = async (
  provider: providers.JsonRpcProvider,
): Promise<string> => {
  try {
    const vanillaRouter = new ethers.Contract(
      vanillaRouterAddress,
      JSON.stringify(vanillaABI),
      provider,
    )
    const vnlTokenAddress = await vanillaRouter.vnlContract()
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
  signer: Signer,
  tokenSold: UniSwapToken,
  tokenReceived: UniSwapToken,
  amountSold: string,
  amountReceived: string,
): Promise<RewardResponse | null> => {
  const [parsedAmountSold, parsedAmountReceived] = [
    tryParseAmount(amountSold, tokenSold),
    tryParseAmount(amountReceived, tokenReceived),
  ]

  const owner = await signer.getAddress()
  const vanillaRouter = new ethers.Contract(
    vanillaRouterAddress,
    JSON.stringify(vanillaABI),
    signer,
  )
  let reward: RewardResponse | null

  try {
    reward = await vanillaRouter.estimateReward(
      owner,
      tokenSold.address,
      parsedAmountReceived?.raw.toString(),
      parsedAmountSold?.raw.toString(),
    )
  } catch (e) {
    reward = null
  }

  return reward
}
