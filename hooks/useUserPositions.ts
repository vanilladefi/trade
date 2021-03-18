import { Token as UniswapToken, TokenAmount, TradeType } from '@uniswap/sdk'
import { formatUnits } from 'ethers/lib/utils'
import { constructTrade } from 'lib/uniswap/trade'
import { estimateReward, RewardResponse, TokenPriceResponse } from 'lib/vanilla'
import { useEffect, useMemo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { currentETHPrice } from 'state/meta'
import { allTokensStoreState, userTokensState } from 'state/tokens'
import { selectedCounterAsset, selectedSlippageTolerance } from 'state/trade'
import { providerState, signerState } from 'state/wallet'
import type { Token } from 'types/trade'
import useETHPrice from './useETHPrice'
import useVanillaRouter from './useVanillaRouter'
import useWalletAddress from './useWalletAddress'

function useUserPositions(): Token[] {
  useETHPrice()
  const ETHPrice = useRecoilValue(currentETHPrice)
  const allTokens = useRecoilValue(allTokensStoreState)
  const counterAsset = useRecoilValue(selectedCounterAsset)
  const [tokens, setTokens] = useRecoilState(userTokensState)
  const vanillaRouter = useVanillaRouter()
  const { long: userAddress } = useWalletAddress()
  const provider = useRecoilValue(providerState)
  const signer = useRecoilValue(signerState)
  const slippageTolerance = useRecoilValue(selectedSlippageTolerance)

  useEffect(() => {
    const filterUserTokens = async (tokens: Token[]): Promise<Token[]> => {
      if (vanillaRouter && userAddress && provider && signer) {
        const tokensWithBalance = await Promise.all(
          tokens.map(async (token) => {
            try {
              const {
                tokenSum,
              }: TokenPriceResponse = await vanillaRouter.tokenPriceData(
                userAddress,
                token.address,
              )

              const parsedUniToken = new UniswapToken(
                token.chainId,
                token.address,
                token.decimals,
              )

              const tokenAmount = new TokenAmount(
                parsedUniToken,
                tokenSum.toString(),
              )

              const parsedOwnedAmount =
                tokenSum && !tokenSum.isZero()
                  ? tokenAmount.toSignificant()
                  : undefined

              const parsedValue =
                tokenSum && !tokenSum.isZero() && token.price
                  ? parseFloat(tokenAmount.toSignificant()) *
                    token.price *
                    parseFloat(ETHPrice)
                  : 0

              const trade = await constructTrade(
                tokenAmount.toSignificant(),
                counterAsset,
                token,
                provider,
                TradeType.EXACT_INPUT,
              )

              const amountOut = trade.minimumAmountOut(slippageTolerance).raw

              const reward: RewardResponse | null = await estimateReward(
                signer,
                token,
                counterAsset,
                tokenAmount.toSignificant(),
                amountOut.toString(),
              )

              const parsedAmountOut = parseFloat(
                formatUnits(amountOut.toString()),
              )
              const profitablePrice =
                reward && parseFloat(formatUnits(reward?.profitablePrice))

              const profitPercentage =
                reward && profitablePrice
                  ? profitablePrice / parsedAmountOut
                  : 0

              const parsedVnl = reward
                ? parseFloat(formatUnits(reward.reward, 12))
                : 0

              return {
                ...token,
                owned: parsedOwnedAmount,
                value: parsedValue,
                profit: profitPercentage.toFixed(3),
                vnl: parsedVnl,
              }
            } catch {
              return { ...token }
            }
          }),
        )
        return tokensWithBalance.filter((token) => token.owned)
      } else {
        return []
      }
    }
    filterUserTokens(allTokens).then((tokensWithBalance) => {
      setTokens(tokensWithBalance)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress, counterAsset, ETHPrice])

  return useMemo(() => {
    return tokens
  }, [tokens])
}

export default useUserPositions
