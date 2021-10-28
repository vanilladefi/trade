import { BigNumber } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { userV2TokensState, userV3TokensState } from 'state/tokens'
import { VanillaVersion } from 'types/general'
import { Token } from 'types/trade'

function useEligibleTokenBalance(
  version: VanillaVersion,
  tokenAddress?: string | null,
): { formatted: string; raw: BigNumber; decimals: number } {
  const [decimals, setDecimals] = useState(0)
  const [formatted, setFormatted] = useState('0')
  const [raw, setRaw] = useState(BigNumber.from(0))

  const userTokens: Token[] = useRecoilValue(
    version === VanillaVersion.V1_0 ? userV2TokensState : userV3TokensState,
  )

  useEffect(() => {
    const token = userTokens?.find(
      (token) => token?.address?.toLowerCase() === tokenAddress?.toLowerCase(),
    )
    if (token) {
      setFormatted(token.owned || '0')
      setRaw(
        token && token.ownedRaw
          ? BigNumber.from(token.ownedRaw)
          : BigNumber.from('0'),
      )
      setDecimals(Number(token.decimals))
    }
  }, [tokenAddress, userTokens])

  return useMemo(
    () => ({
      formatted: formatted,
      raw: raw,
      decimals: decimals,
    }),
    [formatted, raw, decimals],
  )
}

export default useEligibleTokenBalance
