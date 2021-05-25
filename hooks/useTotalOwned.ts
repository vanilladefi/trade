import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { userV2TokensState } from 'state/tokens'

function useTotalOwned(): { USD: number; ETH: number } {
  const userTokens = useRecoilValue(userV2TokensState)

  return useMemo(() => {
    const values =
      userTokens &&
      userTokens.filter((token) => !!token.value).map((token) => token.value)

    // Total value of tokens in USD
    const tokenSum =
      values &&
      values.length > 0 &&
      values.reduce((accumulator, current) =>
        accumulator && current ? accumulator + current : accumulator,
      )

    const tokenValuesInEth =
      userTokens &&
      userTokens.map((token) => {
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
  }, [userTokens])
}

export default useTotalOwned
