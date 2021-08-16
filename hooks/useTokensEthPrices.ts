import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { uniswapV2TokenState } from 'state/tokens'

const useTokensEthPrices = (tokenAddresses: string[]): number[] => {
  const tokens = useRecoilValue(uniswapV2TokenState)

  return useMemo(() => {
    return tokens
      .filter((token) =>
        tokenAddresses
          .map((tokenAddress) => tokenAddress.toLowerCase())
          .includes(token.address.toLowerCase()),
      )
      .map((token) => token.price || 0)
  }, [tokenAddresses, tokens])
}

export default useTokensEthPrices
