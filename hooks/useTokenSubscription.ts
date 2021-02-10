import { useEffect } from 'react'
import { useRecoilCallback } from 'recoil'
import { thegraphClientSub, TokenInfoSubAB, TokenInfoSubBA } from 'lib/graphql'
import { getAllTokens, addData, WETH, weth } from 'lib/tokens'
import { chainId } from 'utils/config'
import { allTokensStoreState } from 'state/tokens'
import type { TokenInfoQueryResponse } from 'types/trade'

if (!weth) {
  throw new Error(
    `Unable to find ${WETH} in uniswap list with "chainId": ${chainId}`,
  )
}

const variables = {
  weth: weth.address.toLowerCase(),
  tokenAddresses: getAllTokens().map(({ address }) => address.toLowerCase()),
}

interface subReturnValue {
  data: { tokens: TokenInfoQueryResponse[] }
}

export default function useTokenSubscription(): void {
  const handleNewData = useRecoilCallback(
    ({ snapshot, set }) => async ({ data }: subReturnValue) => {
      if (data?.tokens?.length) {
        const tokens = await snapshot.getPromise(allTokensStoreState)
        set(allTokensStoreState, addData(tokens, data.tokens))
      }
    },
    [],
  )

  useEffect(() => {
    const subOptions = {
      next: handleNewData,
    }

    const subAB = thegraphClientSub
      .request({
        query: TokenInfoSubAB,
        variables,
      })
      .subscribe(subOptions)

    const subBA = thegraphClientSub
      .request({
        query: TokenInfoSubBA,
        variables,
      })
      .subscribe(subOptions)

    return () => {
      subAB.unsubscribe()
      subBA.unsubscribe()
    }
  }, [handleNewData])
}
