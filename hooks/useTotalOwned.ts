import { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { userV2TokensState, userV3TokensState } from 'state/tokens'
import { PrerenderProps } from 'types/content'

function useTotalOwned(props?: PrerenderProps): {
  USD: number
  ETH: number
} {
  const userV2Tokens = useRecoilValue(userV2TokensState)
  const userV3Tokens = useRecoilValue(userV3TokensState)

  const getUserTokens = useCallback(() => {
    const v2Tokens =
      userV2Tokens?.length > 0
        ? userV2Tokens
        : props?.initialTokens?.userPositionsV2 || []
    const v3Tokens =
      userV3Tokens?.length > 0
        ? userV3Tokens
        : props?.initialTokens?.userPositionsV3 || []
    return [...v2Tokens, ...v3Tokens]
  }, [
    props?.initialTokens?.userPositionsV2,
    props?.initialTokens?.userPositionsV3,
    userV2Tokens,
    userV3Tokens,
  ])

  return useMemo(() => {
    const userTokens = getUserTokens()

    const values = userTokens
      .filter((token) => !!token.value)
      .map((token) => token.value)

    // Total value of tokens in USD
    const tokenSum = values.reduce(
      (accumulator, current) => accumulator + current,
      0,
    )

    const tokenValuesInEth = userTokens.map((token) => {
      if (!!token.owned && token.price) {
        return parseFloat(token.owned) * token.price
      } else {
        return 0
      }
    })
    const totalTokenValueInEth = tokenValuesInEth.reduce(
      (accumulator, current) => accumulator + current,
      0,
    )

    if (tokenSum) {
      return {
        USD: tokenSum,
        ETH: totalTokenValueInEth,
      }
    } else {
      return { USD: 0, ETH: 0 }
    }
  }, [getUserTokens])
}

export default useTotalOwned
