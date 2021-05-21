import { useRecoilValue } from 'recoil'
import { uniswapV2TokenState } from 'state/tokens'

const useTokenEthPrice = (tokenAddress: string): number => {
  const tokens = useRecoilValue(uniswapV2TokenState)

  return (
    tokens.find(
      (token) => token.address.toLowerCase() === tokenAddress.toLowerCase(),
    )?.price ?? 0
  )
}

export default useTokenEthPrice
