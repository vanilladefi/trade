import { formatUnits } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { currentETHPrice } from 'state/meta'
import { userTokensState } from 'state/tokens'
import { useWallet } from 'use-wallet'

function useTotalOwned(): { USD: number; ETH: string } {
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
      return {
        USD: tokenSum + parsedETHBalance * ethPrice,
        ETH: parsedETHBalance.toString(),
      }
    } else {
      return { USD: 0, ETH: '0' }
    }
  }, [balance, ethPrice, userTokens])
}

export default useTotalOwned
