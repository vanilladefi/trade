import { useRecoilValue } from 'recoil'
import { allTokensStoreState } from 'state/tokens'

const useTokenEthPrice = (tokenAddress: string): number => {
  const tokens = useRecoilValue(allTokensStoreState)

  return (
    tokens.find(
      (token) => token.address.toLowerCase() === tokenAddress.toLowerCase(),
    )?.price ?? 0
  )
}

export default useTokenEthPrice
