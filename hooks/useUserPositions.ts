import {
  Token as UniswapToken,
  TokenAmount,
  Trade,
  TradeType,
} from '@uniswap/sdk'
import ERC20 from '@uniswap/v2-periphery/build/ERC20.json'
import { BigNumber } from 'ethers'
import { formatUnits, isAddress } from 'ethers/lib/utils'
import { getContract, tokenListChainId } from 'lib/tokens'
import { constructTrade } from 'lib/uniswap/trade'
import { estimateReward, RewardResponse, TokenPriceResponse } from 'lib/vanilla'
import { useEffect, useMemo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { currentETHPrice } from 'state/meta'
import { allTokensStoreState, userTokensState } from 'state/tokens'
import { selectedCounterAsset, selectedSlippageTolerance } from 'state/trade'
import { providerState, signerState } from 'state/wallet'
import type { Token } from 'types/trade'
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
  const slippageTolerance = useRecoilValue(selectedSlippageTolerance)
  const wallet = useWallet()
  const vnl = useVanillaGovernanceToken()

  useEffect(() => {
    const getTokenBalance = async (token: Token): Promise<BigNumber> => {
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
          return BigNumber.from('0')
        }
      }
      return BigNumber.from('0')
    }
    const filterUserTokens = async (
      tokens: Token[],
    ): Promise<Token[] | null> => {
      if (
        vanillaRouter &&
        userAddress &&
        provider &&
        signer &&
        isAddress(vnl.address)
      ) {
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

            const vnlToken = new UniswapToken(
              tokenListChainId,
              vnl.address,
              vnl.decimals,
            )

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
              !ownedInTotal.isZero()
                ? ownedInTotal.toString()
                : tokenSum.toString(),
            )

            // Owned amount. By default, use the total owned amount.
            // On localhost, fall back to Vanilla router data
            const parsedOwnedAmount = tokenAmount.greaterThan('0')
              ? tokenAmount.toSignificant()
              : undefined

            // Parse value of owned token in USD
            const parsedValue =
              tokenAmount.greaterThan('0') && token.price
                ? parseFloat(tokenAmount.toSignificant()) *
                  token.price *
                  parseFloat(ETHPrice)
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
            const amountOut =
              trade && trade.minimumAmountOut
                ? trade.minimumAmountOut(slippageTolerance).raw
                : undefined
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
              profit: profitPercentage,
              vnl: parsedVnl,
            }
          }),
        )
        return tokensWithBalance.filter((token) => token.owned)
      } else if (wallet.status === 'disconnected') {
        return []
      } else {
        return null
      }
    }
    filterUserTokens(allTokens).then((tokensWithBalance) => {
      setTokens(tokensWithBalance)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress, counterAsset, ETHPrice, wallet.status, setTokens])

  return useMemo(() => {
    return tokens
  }, [tokens])
}

export default useUserPositions
