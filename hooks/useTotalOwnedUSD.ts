import { formatUnits } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { currentETHPrice } from 'state/meta'
import { userTokensState } from 'state/tokens'
import { useWallet } from 'use-wallet'

function useTotalOwnedUSD(): number {
  const userTokens = useRecoilValue(userTokensState)
  const ethPrice = useRecoilValue(currentETHPrice)
  const { balance } = useWallet()

  return useMemo(() => {
    const parsedETHBalance = parseFloat(formatUnits(balance, 18))

    const values =
      userTokens &&
      userTokens.filter((token) => !!token.value).map((token) => token.value)

    const tokenSum =
      values &&
      values.length > 0 &&
      values.reduce((accumulator, current) =>
        accumulator && current ? accumulator + current : accumulator,
      )

    if (tokenSum) {
      return tokenSum + parsedETHBalance * ethPrice
    } else {
      return 0
    }
  }, [balance, ethPrice, userTokens])
}

export default useTotalOwnedUSD
