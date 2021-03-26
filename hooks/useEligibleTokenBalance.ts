import { BigNumber } from 'ethers'
import { useRecoilValue } from 'recoil'
import { userTokensState } from 'state/tokens'

function useEligibleTokenBalance(
  tokenAddress?: string | null,
): { formatted: string; raw: BigNumber; decimals: number } {
  let decimals = 0
  let formatted = '0'
  let raw: BigNumber = BigNumber.from('0')

  const userTokens = useRecoilValue(userTokensState)
  const token =
    tokenAddress &&
    userTokens?.find(
      (token) => token.address.toLowerCase() === tokenAddress.toLowerCase(),
    )

  if (token) {
    formatted = token.owned || '0'
    raw =
      token && token.ownedRaw
        ? BigNumber.from(token.ownedRaw)
        : BigNumber.from('0')

    decimals = token.decimals
  }

  return {
    formatted: formatted,
    raw: raw,
    decimals: decimals,
  }
}

export default useEligibleTokenBalance
