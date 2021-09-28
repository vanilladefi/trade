import { Percent as V2Percent, Trade as TradeV2 } from '@uniswap/sdk'
import {
  Percent,
  Token as UniswapToken,
  TokenAmount,
  TradeType,
} from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { BigNumber, ethers, providers, Signer } from 'ethers'
import { formatUnits, getAddress } from 'ethers/lib/utils'
import {
  getAllTokens,
  getETHPrice,
  isAddress,
  tokenListChainId,
  weth,
} from 'lib/tokens'
import {
  constructTrade as constructV2Trade,
  tryParseAmount,
} from 'lib/uniswap/v2/trade'
import { constructTrade as constructV3Trade } from 'lib/uniswap/v3/trade'
import { getVanillaRouter } from 'lib/vanilla/contracts'
import vanillaRouter from 'types/abis/vanillaRouter.json'
import { UniswapVersion, VanillaVersion } from 'types/general'
import {
  Operation,
  RewardEstimate,
  RewardResponse,
  Token,
  TokenPriceResponse,
  V3Trade,
} from 'types/trade'
import { VanillaV1Router02__factory } from 'types/typechain/vanilla_v1.1'
import {
  blockDeadlineThreshold,
  defaultProvider,
  epoch,
  getVanillaRouterAddress,
  getVnlTokenAddress,
  vnlDecimals,
} from 'utils/config'

export const estimateReward = async (
  version: VanillaVersion,
  owner: string,
  signerOrProvider: Signer | providers.Provider,
  tokenSold: Token,
  tokenReceived: Token,
  amountSold: string,
  amountReceived: string,
): Promise<RewardResponse | null> => {
  const [parsedAmountSold, parsedAmountReceived] = [
    tryParseAmount(amountSold, tokenSold),
    tryParseAmount(amountReceived, tokenReceived),
  ]
  let reward: RewardResponse | null = null
  if (
    parsedAmountReceived &&
    parsedAmountSold &&
    parsedAmountReceived.greaterThan('0') &&
    parsedAmountSold.greaterThan('0') &&
    isAddress(owner)
  ) {
    const router =
      version === VanillaVersion.V1_0
        ? new ethers.Contract(
            getVanillaRouterAddress(VanillaVersion.V1_0),
            JSON.stringify(vanillaRouter.abi),
            signerOrProvider,
          )
        : VanillaV1Router02__factory.connect(
            getVanillaRouterAddress(VanillaVersion.V1_1),
            signerOrProvider,
          )

    try {
      reward = await router.estimateReward(
        owner,
        tokenSold.address,
        parsedAmountReceived?.raw.toString(),
        parsedAmountSold?.raw.toString(),
      )
    } catch (e) {
      console.error('estimateReward', e)
      reward = null
    }
  }
  return reward
}

export const getPriceData = async (
  version: VanillaVersion,
  owner: string,
  signerOrProvider: Signer | providers.Provider,
  tokenAddress: string,
): Promise<TokenPriceResponse | null> => {
  const router =
    version === VanillaVersion.V1_0
      ? new ethers.Contract(
          getVanillaRouterAddress(VanillaVersion.V1_0),
          JSON.stringify(vanillaRouter.abi),
          signerOrProvider,
        )
      : VanillaV1Router02__factory.connect(
          getVanillaRouterAddress(VanillaVersion.V1_1),
          signerOrProvider,
        )
  let priceData: TokenPriceResponse | null

  try {
    priceData = await router.tokenPriceData(owner, tokenAddress)
  } catch (e) {
    priceData = null
  }

  return priceData
}

export const getEpoch = async (
  version: VanillaVersion,
  signerOrProvider: Signer | providers.Provider,
): Promise<BigNumber | null> => {
  let epoch: BigNumber | null

  const router =
    version === VanillaVersion.V1_0
      ? new ethers.Contract(
          getVanillaRouterAddress(VanillaVersion.V1_0),
          JSON.stringify(vanillaRouter.abi),
          signerOrProvider,
        )
      : VanillaV1Router02__factory.connect(
          getVanillaRouterAddress(VanillaVersion.V1_1),
          signerOrProvider,
        )

  try {
    epoch = await router.epoch()
  } catch (e) {
    epoch = null
  }

  return epoch
}

export const estimateGas = async (
  version: VanillaVersion,
  trade: TradeV2 | V3Trade,
  signer: Signer,
  provider: providers.Provider,
  operation: Operation,
  token0: Token,
  slippageTolerance: Percent | V2Percent,
): Promise<BigNumber> => {
  const routerV1_0 = new ethers.Contract(
    getVanillaRouterAddress(VanillaVersion.V1_0),
    JSON.stringify(vanillaRouter.abi),
    signer,
  )
  const routerV1_1 = VanillaV1Router02__factory.connect(
    getVanillaRouterAddress(VanillaVersion.V1_1),
    signer,
  )

  let gasEstimate: BigNumber = BigNumber.from('0')
  try {
    if (signer && trade && provider) {
      const block = await provider.getBlock('latest')
      const blockDeadline = block.timestamp + blockDeadlineThreshold
      const gasPrice = await provider.getGasPrice()

      if (version === VanillaVersion.V1_0 && routerV1_0) {
        const normalizedSlippageTolerance = new V2Percent(
          slippageTolerance.numerator,
          slippageTolerance.denominator,
        )
        const normalizedTrade = trade as TradeV2
        if (operation === Operation.Buy) {
          gasEstimate = await routerV1_0.estimateGas.depositAndBuy(
            token0.address,
            normalizedTrade
              ?.minimumAmountOut(normalizedSlippageTolerance)
              .raw.toString(),
            blockDeadline,
            {
              value: normalizedTrade?.inputAmount.raw.toString(),
              gasPrice: gasPrice,
            },
          )
        } else {
          gasEstimate = await routerV1_0.estimateGas.sellAndWithdraw(
            token0.address,
            normalizedTrade?.inputAmount.raw.toString(),
            normalizedTrade
              ?.minimumAmountOut(normalizedSlippageTolerance)
              .raw.toString(),
            blockDeadline,
            {
              gasPrice: gasPrice,
            },
          )
        }
      } else if (version === VanillaVersion.V1_1 && routerV1_1) {
        const normalizedTrade = trade as V3Trade
        const normalizedSlippageTolerance = slippageTolerance as Percent
        if (operation === Operation.Buy) {
          const buyOrder = {
            token: token0.address,
            useWETH: false,
            numEth: normalizedTrade.inputAmount.raw.toString(),
            numToken: normalizedTrade
              .minimumAmountOut(normalizedSlippageTolerance)
              .raw.toString(),
            blockTimeDeadline: blockDeadline,
            fee: 3000,
          }
          gasEstimate = await routerV1_1.estimateGas.executePayable(
            [routerV1_1.interface.encodeFunctionData('buy', [buyOrder])],
            {
              value: normalizedTrade.inputAmount.raw.toString(),
              gasPrice: gasPrice,
            },
          )
        } else {
          const sellOrder = {
            token: token0.address,
            useWETH: false,
            numEth: normalizedTrade
              .minimumAmountOut(normalizedSlippageTolerance)
              .raw.toString(),
            numToken: normalizedTrade.inputAmount.raw.toString(),
            blockTimeDeadline: blockDeadline,
            fee: 3000,
          }
          gasEstimate = await routerV1_1.estimateGas.executePayable(
            [routerV1_1.interface.encodeFunctionData('sell', [sellOrder])],
            { gasPrice: gasPrice },
          )
        }
      }
    }
  } catch (e) {
    console.error('estimateGas', e)
  }
  return gasEstimate
}

export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000 + 2500)).div(BigNumber.from(10000))
}

export async function getUserPositions(
  version: VanillaVersion,
  address: string,
  tokens?: Token[],
): Promise<Token[]> {
  const checkSummedAddress = isAddress(address)
  const vanillaRouter = getVanillaRouter(version, defaultProvider)
  const million = 1000000
  const allTokens = tokens || getAllTokens(version)
  const ETHPrice = await getETHPrice(
    version === VanillaVersion.V1_0 ? UniswapVersion.v2 : UniswapVersion.v3,
  )
  let positions: Token[] = []
  if (checkSummedAddress && vanillaRouter) {
    positions = await Promise.all(
      allTokens.map(async (token) => {
        // Fetch price data from Vanilla router
        let tokenSum: BigNumber = BigNumber.from(0)
        const priceResponse: TokenPriceResponse =
          await vanillaRouter.tokenPriceData(checkSummedAddress, token.address)
        tokenSum = priceResponse.tokenSum

        if (!tokenSum.isZero()) {
          // VNL governance token
          const vnlToken = new UniswapToken(
            tokenListChainId,
            getAddress(getVnlTokenAddress(version)),
            vnlDecimals,
          )

          // Construct helpers for upcoming calculations
          const parsedUniToken = new UniswapToken(
            Number(token.chainId),
            getAddress(token.address),
            Number(token.decimals),
          )

          // Construct token amount from Vanilla router reported amounts
          const tokenAmount = new TokenAmount(
            parsedUniToken,
            tokenSum.toString(),
          )

          // Owned amount. By default, use the total owned amount.
          // If zero, exclude from user's owned tokens
          const parsedOwnedAmount = tokenAmount.greaterThan('0')
            ? tokenAmount.toSignificant()
            : undefined

          // Parse value of owned token in USD
          const parsedValue =
            tokenAmount.greaterThan('0') && token.price
              ? parseFloat(tokenAmount.toSignificant()) * token.price * ETHPrice
              : 0

          // Get current best trade from Uniswap to calculate available rewards
          let trade: TradeV2 | V3Trade | null = null
          try {
            if (version === VanillaVersion.V1_0) {
              trade = await constructV2Trade(
                defaultProvider,
                tokenAmount.toSignificant(),
                weth,
                token,
                TradeType.EXACT_INPUT,
              )
            } else if (version === VanillaVersion.V1_1) {
              trade = await constructV3Trade(
                defaultProvider,
                tokenAmount.toSignificant(),
                weth,
                token,
                TradeType.EXACT_INPUT,
              )
            }
          } catch (e) {
            console.error('Could not construct trade: ', e)
          }

          // Amount out from the trade as a Bignumber gwei string and an ether float
          const amountOut = trade?.outputAmount.raw ?? undefined
          const parsedAmountOut =
            amountOut && formatUnits(amountOut.toString(), weth.decimals)

          let reward: RewardResponse | null = null
          // Get reward estimate from Vanilla router
          reward = amountOut
            ? await estimateReward(
                version,
                address,
                defaultProvider,
                token,
                weth,
                tokenAmount.toSignificant(),
                parsedAmountOut,
              )
            : null

          let vpc: string | null = null
          if (reward?.vpc) {
            // Parse VPC
            const vpcNum = reward?.vpc.toNumber() ?? 0
            vpc = (vpcNum / million).toString()
          }

          // Calculate HTRS
          const priceData = await getPriceData(
            version,
            address,
            defaultProvider,
            token.address,
          )
          const blockNumber = await defaultProvider.getBlockNumber()
          const avgBlock =
            priceData?.weightedBlockSum.div(priceData?.tokenSum) ??
            BigNumber.from('0')
          const bhold = BigNumber.from(blockNumber.toString()).sub(avgBlock)
          const btrade = epoch
            ? BigNumber.from(blockNumber.toString()).sub(epoch)
            : BigNumber.from('0')

          let htrs = '0'
          try {
            htrs = (
              bhold.mul(bhold).mul(million).div(btrade.mul(btrade)).toNumber() /
              million
            ).toString()
          } catch (e) {
            console.error('Could not calculate HTRS: ', e)
          }

          // Parse the minimum profitable price from the reward estimate
          let profitablePrice: string | undefined
          let usedEstimate: keyof RewardEstimate
          if (version === VanillaVersion.V1_0 && reward?.profitablePrice) {
            profitablePrice = formatUnits(reward.profitablePrice)
          } else if (version === VanillaVersion.V1_1 && reward?.estimate) {
            switch (Number(token.fee)) {
              case FeeAmount.LOW:
                usedEstimate = 'low'
                break
              case FeeAmount.MEDIUM:
                usedEstimate = 'medium'
                break
              case FeeAmount.HIGH:
                usedEstimate = 'high'
                break
              default:
                usedEstimate = 'medium'
            }
            profitablePrice = formatUnits(
              reward?.estimate[usedEstimate].profitablePrice,
            )
          }

          // Calculate profit percentage
          let profitPercentage = 0
          try {
            profitPercentage =
              reward && profitablePrice && parsedAmountOut
                ? -(parseFloat(profitablePrice) - parseFloat(parsedAmountOut)) /
                  parseFloat(profitablePrice)
                : 0
          } catch (e) {
            console.error(
              'Could not calculate profit percentage. Falling back to 0: ',
              e,
            )
          }

          // Parse the available VNL reward
          let parsedVnl = 0
          if (version === VanillaVersion.V1_0 && reward?.reward) {
            parsedVnl = parseFloat(
              new TokenAmount(
                vnlToken,
                reward.reward.toString(),
              ).toSignificant(),
            )
          } else if (version === VanillaVersion.V1_1 && reward?.estimate) {
            parsedVnl = parseFloat(
              new TokenAmount(
                vnlToken,
                reward.estimate[usedEstimate].reward.toString(),
              ).toSignificant(),
            )
          }

          return {
            ...token,
            owned: parsedOwnedAmount,
            ownedRaw: tokenAmount.raw.toString(),
            value: parsedValue,
            htrs: htrs,
            vpc: vpc,
            profit: profitPercentage,
            vnl: parsedVnl,
          }
        } else {
          return token
        }
      }),
    )
    positions = positions.filter((token) => token.owned)
  }
  return positions
}
