import { Token as UniswapToken, TokenAmount, TradeType } from '@uniswap/sdk'
import ERC20 from '@uniswap/v2-periphery/build/ERC20.json'
import { BigNumber } from 'ethers'
import { formatUnits, isAddress } from 'ethers/lib/utils'
import { getContract } from 'lib/tokens'
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

  const getTokenBalance = async (token: Token): Promise<string> => {
    if (token.address && token.decimals && token.chainId && signer) {
      try {
        const contract = getContract(token.address, ERC20.abi, signer)
        //const parsedToken = new UniswapToken(token.chainId, token.address, token.decimals)
        const raw =
          contract && isAddress(userAddress)
            ? await contract.balanceOf(userAddress)
            : '0'
        //const formatted = new TokenAmount(parsedToken, raw.toString())
        return raw
      } catch (e) {
        return '0'
      }
    }
    return '0'
  }

  useEffect(() => {
    const filterUserTokens = async (tokens: Token[]): Promise<Token[]> => {
      if (vanillaRouter && userAddress && provider && signer) {
        const tokensWithBalance = await Promise.all(
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

            // Fetch token balances (Doesn't really work on localhost)
            const ownedInTotal = await getTokenBalance(token)

            // Construct helpers for upcoming calculations
            const parsedUniToken = new UniswapToken(
              token.chainId,
              token.address,
              token.decimals,
            )
            const tokenAmount = new TokenAmount(
              parsedUniToken,
              tokenSum.toString(),
            )

            // Owned amount. By default, use the total owned amount.
            // On localhost, fall back to Vanilla router data
            const parsedOwnedAmount =
              ownedInTotal !== '0'
                ? ownedInTotal
                : tokenSum && !tokenSum.isZero()
                ? tokenAmount.toSignificant()
                : undefined

            // Parse value of owned token in USD
            const parsedValue =
              tokenSum && !tokenSum.isZero() && token.price
                ? parseFloat(tokenAmount.toSignificant()) *
                  token.price *
                  parseFloat(ETHPrice)
                : 0

            // Get current best trade from Uniswap to calculate available rewards
            const trade = await constructTrade(
              tokenAmount.toSignificant(),
              counterAsset,
              token,
              provider,
              TradeType.EXACT_INPUT,
            )

            // Amount out from the trade as a Bignumber gwei string and an ether float
            const amountOut = trade.minimumAmountOut(slippageTolerance).raw
            const parsedAmountOut = parseFloat(
              formatUnits(amountOut.toString()),
            )

            let reward: RewardResponse | null
            try {
              // Get reward estimate from Vanilla router
              reward = await estimateReward(
                signer,
                token,
                counterAsset,
                tokenAmount.toSignificant(),
                amountOut.toString(),
              )
            } catch (e) {
              // Catch error from reward estimation. This probably means that the Vanilla router hasn't been deployed on the used network.
              reward = null
            }

            // Parse the minimum profitable price from the reward estimate
            const profitablePrice =
              reward && parseFloat(formatUnits(reward?.profitablePrice))

            // Calculate profit percentage
            const profitPercentage =
              reward && profitablePrice ? profitablePrice / parsedAmountOut : 0

            // Parse the available VNL reward
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
