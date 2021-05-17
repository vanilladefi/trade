import { getAverageBlockCountPerHour } from 'lib/block'
import {
  getTheGraphClient,
  TokenInfoSubAB,
  TokenInfoSubBA,
  UniswapVersion,
} from 'lib/graphql'
import { addData, addGraphInfo, getAllTokens, weth } from 'lib/tokens'
import { useEffect } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { currentBlockNumberState, currentETHPrice } from 'state/meta'
import { allTokensStoreState } from 'state/tokens'
import type { TokenInfoQueryResponse } from 'types/trade'

const variables = {
  weth: weth.address.toLowerCase(),
  tokenAddresses: getAllTokens().map(({ address }) => address.toLowerCase()),
}

interface subReturnValue {
  data: { tokens: TokenInfoQueryResponse[] }
}

export default function useTokenSubscription(): void {
  const currentBlockNumber = useRecoilValue(currentBlockNumberState)
  const ethPrice = useRecoilValue(currentETHPrice)

  const handleNewData = useRecoilCallback(
    ({ set }) => async ({ data }: subReturnValue) => {
      console.log(data)
      if (data?.tokens?.length && ethPrice > 0) {
        set(allTokensStoreState, (tokens) =>
          addData(tokens, data.tokens, false, ethPrice),
        )
      }
    },
    [],
  )

  const addHistoricalData = useRecoilCallback(
    ({ snapshot, set }) => async (blockNumber: number) => {
      const tokens = await snapshot.getPromise(allTokensStoreState)
      if (blockNumber > 0 && tokens?.length && ethPrice > 0) {
        set(
          allTokensStoreState,
          await addGraphInfo(tokens, blockNumber, ethPrice),
        )
      }
    },
    [],
  )

  useEffect(() => {
    const subOptions = {
      next: handleNewData,
    }

    const { ws } = getTheGraphClient(UniswapVersion.v2)

    const subAB = ws
      .request({
        query: TokenInfoSubAB,
        variables,
      })
      .subscribe(subOptions)

    const subBA = ws
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

  // Handle price change fetching
  useEffect(() => {
    getAverageBlockCountPerHour().then((blocksPerHour) => {
      addHistoricalData(currentBlockNumber - 24 * blocksPerHour)
    })
  }, [addHistoricalData, currentBlockNumber])
}
