import { PrerenderProps } from 'pages/trade'
import { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { userV2TokensState, userV3TokensState } from 'state/tokens'

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
  }, [props, userV2Tokens, userV3Tokens])

  return useMemo(() => {
    const values =
      getUserTokens() &&
      getUserTokens()
        .filter((token) => !!token.value)
        .map((token) => token.value)

    // Total value of tokens in USD
    const tokenSum =
      values &&
      values.length > 0 &&
      values.reduce((accumulator, current) =>
        accumulator && current ? accumulator + current : accumulator,
      )

    const tokenValuesInEth =
      getUserTokens() &&
      getUserTokens().map((token) => {
        if (!!token.owned && token.price) {
          return parseFloat(token.owned) * token.price
        } else {
          return 0
        }
      })
    const totalTokenValueInEth =
      (tokenValuesInEth &&
        tokenValuesInEth.length > 0 &&
        tokenValuesInEth.reduce(
          (accumulator, current) => accumulator + current,
        )) ||
      0

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
