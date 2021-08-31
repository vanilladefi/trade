import { Trade as V2Trade } from '@uniswap/sdk'
import {
  Token as UniswapToken,
  TokenAmount,
  TradeType,
} from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { BigNumber } from 'ethers'
import { formatUnits, getAddress, isAddress } from 'ethers/lib/utils'
import { UniswapVersion } from 'lib/graphql'
import { tokenListChainId } from 'lib/tokens'
import { constructTrade as constructV2Trade } from 'lib/uniswap/v2/trade'
import { constructTrade as constructV3Trade } from 'lib/uniswap/v3/trade'
import { estimateReward, getEpoch, getPriceData } from 'lib/vanilla'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { currentETHPrice } from 'state/meta'
import {
  uniswapV2TokenState,
  uniswapV3TokenState,
  userV2TokensState,
  userV3TokensState,
} from 'state/tokens'
import { selectedCounterAsset } from 'state/trade'
import { providerState } from 'state/wallet'
import { VanillaVersion } from 'types/general'
import {
  RewardEstimate,
  RewardResponse,
  Token,
  TokenPriceResponse,
  V3Trade,
} from 'types/trade'
import { useWallet } from 'use-wallet'
import useETHPrice from './useETHPrice'
import useVanillaGovernanceToken from './useVanillaGovernanceToken'
import useVanillaRouter from './useVanillaRouter'
import useWalletAddress from './useWalletAddress'

function useUserPositions(version: VanillaVersion): Token[] | null {
  useETHPrice(UniswapVersion.v3)
  const ETHPrice = useRecoilValue(currentETHPrice)
  const allTokens = useRecoilValue(
    version === VanillaVersion.V1_0 ? uniswapV2TokenState : uniswapV3TokenState,
  )
  const counterAsset = useRecoilValue(selectedCounterAsset)
  const [tokens, setTokens] = useRecoilState(
    version === VanillaVersion.V1_0 ? userV2TokensState : userV3TokensState,
  )
  const vanillaRouter = useVanillaRouter(version)
  const { long: userAddress } = useWalletAddress()
  const provider = useRecoilValue(providerState)
  const wallet = useWallet()
  const vnl = useVanillaGovernanceToken(version)

  useEffect(() => {
    const filterUserTokens = async (
      tokens: Token[],
    ): Promise<Token[] | null> => {
      let tokensWithBalance: Token[] | null = null
      if (vanillaRouter && userAddress && provider && isAddress(vnl.address)) {
        try {
          tokensWithBalance = await Promise.all(
            tokens.map(async (token) => {
              // Fetch price data from Vanilla router
              let tokenSum: BigNumber
              try {
                const priceResponse: TokenPriceResponse =
                  await vanillaRouter.tokenPriceData(userAddress, token.address)
                tokenSum = priceResponse.tokenSum
              } catch (e) {
                tokenSum = BigNumber.from('0')
              }

              if (!tokenSum.isZero()) {
                // VNL governance token
                const vnlToken = new UniswapToken(
                  tokenListChainId,
                  getAddress(vnl.address),
                  vnl.decimals,
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
                    ? parseFloat(tokenAmount.toSignificant()) *
                      token.price *
                      ETHPrice
                    : 0

                // Get current best trade from Uniswap to calculate available rewards
                let trade: V2Trade | V3Trade | null
                try {
                  if (version === VanillaVersion.V1_0) {
                    trade = await constructV2Trade(
                      provider,
                      tokenAmount.toSignificant(),
                      counterAsset,
                      token,
                      TradeType.EXACT_INPUT,
                    )
                  } else if (version === VanillaVersion.V1_1) {
                    trade = await constructV3Trade(
                      provider,
                      tokenAmount.toSignificant(),
                      counterAsset,
                      token,
                      TradeType.EXACT_INPUT,
                    )
                  }
                } catch (e) {
                  trade = null
                }

                // Amount out from the trade as a Bignumber gwei string and an ether float
                const amountOut = trade?.outputAmount.raw ?? undefined
                const parsedAmountOut =
                  amountOut &&
                  parseFloat(
                    formatUnits(amountOut.toString(), counterAsset.decimals),
                  )

                let reward: RewardResponse | null
                try {
                  // Get reward estimate from Vanilla router
                  reward = amountOut
                    ? await estimateReward(
                        version,
                        userAddress,
                        provider,
                        token,
                        counterAsset,
                        tokenAmount.toSignificant(),
                        parsedAmountOut?.toString() || '0',
                      )
                    : null
                } catch (e) {
                  // Catch error from reward estimation. This probably means that the Vanilla router hasn't been deployed on the used network.
                  reward = null
                }

                let vpc: string | undefined
                if (reward?.vpc) {
                  // Parse VPC
                  const vpcNum = reward?.vpc.toNumber() ?? 0
                  vpc = (vpcNum / million).toString()
                }

                // Calculate HTRS
                let priceData,
                  blockNumber,
                  epoch: BigNumber | null = BigNumber.from('0')
                let htrs: string
                try {
                  priceData = await getPriceData(
                    version,
                    userAddress,
                    provider,
                    token.address,
                  )
                  blockNumber = await provider.getBlockNumber()
                  epoch = await getEpoch(version, provider)
                  const avgBlock =
                    priceData?.weightedBlockSum.div(priceData?.tokenSum) ??
                    BigNumber.from('0')
                  const bhold = BigNumber.from(blockNumber.toString()).sub(
                    avgBlock,
                  )
                  const btrade = epoch
                    ? BigNumber.from(blockNumber.toString()).sub(epoch)
                    : BigNumber.from('0')
                  htrs = (
                    bhold
                      .mul(bhold)
                      .mul(million)
                      .div(btrade.mul(btrade))
                      .toNumber() / million
                  ).toString()
                } catch (e) {
                  htrs = '0'
                }

                // Parse the minimum profitable price from the reward estimate
                let profitablePrice: number | undefined
                let usedEstimate: keyof RewardEstimate
                if (
                  version === VanillaVersion.V1_0 &&
                  reward?.profitablePrice
                ) {
                  profitablePrice = parseFloat(
                    formatUnits(reward.profitablePrice),
                  )
                } else if (
                  version === VanillaVersion.V1_1 &&
                  reward?.estimate
                ) {
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
                  profitablePrice = parseFloat(
                    formatUnits(reward?.estimate[usedEstimate].profitablePrice),
                  )
                }

                // Calculate profit percentage
                const profitPercentage =
                  reward && profitablePrice && parsedAmountOut
                    ? -(profitablePrice - parsedAmountOut) / profitablePrice
                    : 0

                // Parse the available VNL reward
                let parsedVnl = 0
                if (version === VanillaVersion.V1_0 && reward?.reward) {
                  parsedVnl = parseFloat(
                    new TokenAmount(
                      vnlToken,
                      reward.reward.toString(),
                    ).toSignificant(),
                  )
                } else if (
                  version === VanillaVersion.V1_1 &&
                  reward?.estimate
                ) {
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
        } catch (e) {
          console.error(e)
          tokensWithBalance = []
        }
      }

      return (
        tokensWithBalance && tokensWithBalance.filter((token) => token.owned)
      )
    }
    filterUserTokens(allTokens).then((tokensWithBalance) => {
      setTokens(tokensWithBalance)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userAddress,
    counterAsset,
    wallet.status,
    setTokens,
    vnl.address,
    provider,
    version,
  ])

  return tokens
}

export default useUserPositions
