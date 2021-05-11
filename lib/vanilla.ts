import { Percent } from '@uniswap/sdk-core'
import { Trade } from '@uniswap/v2-sdk'
import { BigNumber, ethers, providers, Signer } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import vanillaRouter from 'types/abis/vanillaRouter.json'
import { Operation, UniSwapToken } from 'types/trade'
import { blockDeadlineThreshold, vanillaRouterAddress } from 'utils/config'
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
  const router = new ethers.Contract(
    vanillaRouterAddress,
    JSON.stringify(vanillaRouter.abi),
    signer,
  )
  let reward: RewardResponse | null

  try {
    reward = await router.estimateReward(
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

export const getPriceData = async (
  signer: Signer,
  tokenAddress: string,
): Promise<TokenPriceResponse | null> => {
  const owner = await signer.getAddress()
  const router = new ethers.Contract(
    vanillaRouterAddress,
    JSON.stringify(vanillaRouter.abi),
    signer,
  )
  let priceData: TokenPriceResponse | null

  try {
    priceData = await router.tokenPriceData(owner, tokenAddress)
  } catch (e) {
    priceData = null
  }

  return priceData
}

export const getEpoch = async (signer: Signer): Promise<BigNumber | null> => {
  const router = new ethers.Contract(
    vanillaRouterAddress,
    JSON.stringify(vanillaRouter.abi),
    signer,
  )
  let epoch: BigNumber | null

  try {
    epoch = await router.epoch()
  } catch (e) {
    epoch = null
  }

  return epoch
}

export const estimateGas = async (
  trade: Trade,
  provider: providers.Provider,
  operation: Operation,
  token0: UniSwapToken,
  slippageTolerance: Percent,
): Promise<string> => {
  const router = new ethers.Contract(
    vanillaRouterAddress,
    JSON.stringify(vanillaRouter.abi),
    provider,
  )
  let gasEstimate = '0'
  if (provider && router && trade) {
    const block = await provider.getBlock('latest')
    const blockDeadline = block.timestamp + blockDeadlineThreshold
    if (operation === Operation.Buy) {
      gasEstimate = await router.estimateGas
        .depositAndBuy(
          token0.address,
          trade?.minimumAmountOut(slippageTolerance).raw.toString(),
          blockDeadline,
          {
            value: trade?.inputAmount.raw.toString(),
          },
        )
        .then(async (value) => {
          const price = await provider.getGasPrice()
          return formatUnits(value.mul(price))
        })
    } else {
      gasEstimate = await router.estimateGas
        .sellAndWithdraw(
          token0.address,
          trade?.inputAmount.raw.toString(),
          trade?.minimumAmountOut(slippageTolerance).raw.toString(),
          blockDeadline,
        )
        .then(async (value) => {
          const price = await provider.getGasPrice()
          return formatUnits(value.mul(price))
        })
    }
  }
  return gasEstimate
}
