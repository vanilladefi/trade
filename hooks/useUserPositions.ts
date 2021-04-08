import {
  Token as UniswapToken,
  TokenAmount,
  Trade,
  TradeType,
} from '@uniswap/sdk'
import { BigNumber } from 'ethers'
import { formatUnits, isAddress } from 'ethers/lib/utils'
import { tokenListChainId } from 'lib/tokens'
import { constructTrade } from 'lib/uniswap/trade'
import { estimateReward, RewardResponse, TokenPriceResponse } from 'lib/vanilla'
import { useEffect, useMemo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { currentETHPrice } from 'state/meta'
import { allTokensStoreState, userTokensState } from 'state/tokens'
import { selectedCounterAsset } from 'state/trade'
import { providerState, signerState } from 'state/wallet'
import { Token } from 'types/trade'
import { useWallet } from 'use-wallet'
import useETHPrice from './useETHPrice'
import useVanillaGovernanceToken from './useVanillaGovernanceToken'
import useVanillaRouter from './useVanillaRouter'
import useWalletAddress from './useWalletAddress'

function useUserPositions(): Token[] | null {
  useETHPrice()
  const ETHPrice = useRecoilValue(currentETHPrice)
  const allTokens = useRecoilValue(allTokensStoreState)
  const counterAsset = useRecoilValue(selectedCounterAsset)
  const [tokens, setTokens] = useRecoilState(userTokensState)
  const vanillaRouter = useVanillaRouter()
  const { long: userAddress } = useWalletAddress()
  const provider = useRecoilValue(providerState)
  const signer = useRecoilValue(signerState)
  const wallet = useWallet()
  const vnl = useVanillaGovernanceToken()

  useEffect(() => {
    const filterUserTokens = async (
      tokens: Token[],
    ): Promise<Token[] | null> => {
      let tokensWithBalance: Token[] | null = null
      if (
        vanillaRouter &&
        userAddress &&
        provider &&
        signer &&
        isAddress(vnl.address)
      ) {
        try {
          tokensWithBalance = await Promise.all(
            tokens.map(async (token) => {
              // Fetch price data from Vanilla router
              let tokenSum
              try {
                const priceResponse: TokenPriceResponse = await vanillaRouter.tokenPriceData(
                  userAddress,
                  token.address,
                )
                tokenSum = priceResponse.tokenSum
              } catch (e) {
                tokenSum = BigNumber.from('0')
              }

              // VNL governance token
              const vnlToken = new UniswapToken(
                tokenListChainId,
                vnl.address,
                vnl.decimals,
              )

              // Construct helpers for upcoming calculations
              const parsedUniToken = new UniswapToken(
                token.chainId,
                token.address,
                token.decimals,
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
              let trade: Trade | null
              try {
                trade = await constructTrade(
                  tokenAmount.toSignificant(),
                  counterAsset,
                  token,
                  provider,
                  TradeType.EXACT_INPUT,
                )
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
                      signer,
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

              // Parse the HODL mode stats
              const htrsNum = reward?.htrs.toNumber() ?? 0
              const vpcNum = reward?.vpc.toNumber() ?? 0
              const htrs: string = (htrsNum / 1000000).toString()
              const vpc: string = (vpcNum / 1000000).toString()

              // Parse the minimum profitable price from the reward estimate
              const profitablePrice =
                reward && parseFloat(formatUnits(reward?.profitablePrice))

              // Calculate profit percentage
              const profitPercentage =
                reward && profitablePrice && parsedAmountOut
                  ? -(profitablePrice - parsedAmountOut) / parsedAmountOut
                  : 0

              // Parse the available VNL reward
              const parsedVnl = reward
                ? parseFloat(
                    new TokenAmount(
                      vnlToken,
                      reward.reward.toString(),
                    ).toSignificant(),
                  )
                : 0

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
            }),
          )
        } catch (e) {
          tokensWithBalance = []
        }
      } /* else if (wallet.status === 'connected' && !isAddress(vnl.address)) {
        // This means that Vanilla hasn't been deployed to the used chain
        tokensWithBalance = []
      } */
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
    ETHPrice,
    wallet.status,
    setTokens,
    vnl.address,
  ])

  return useMemo(() => {
    return tokens
  }, [tokens])
}

export default useUserPositions
