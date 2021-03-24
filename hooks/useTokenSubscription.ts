import { getAverageBlockCountPerHour } from 'lib/block'
import { thegraphClientSub, TokenInfoSubAB, TokenInfoSubBA } from 'lib/graphql'
import {
  addData,
  addGraphInfo,
  addVnlEligibility,
  getAllTokens,
  weth,
} from 'lib/tokens'
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
    ({ snapshot, set }) => async ({ data }: subReturnValue) => {
      let tokens = await snapshot.getPromise(allTokensStoreState)
      tokens = await addVnlEligibility(tokens)
      if (data?.tokens?.length && ethPrice > 0) {
        tokens = addData(tokens, data.tokens, false, ethPrice)
      }
      set(allTokensStoreState, tokens)
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

  // Handle price change fetching
  useEffect(() => {
    getAverageBlockCountPerHour().then((blocksPerHour) => {
      addHistoricalData(currentBlockNumber - 24 * blocksPerHour)
    })
  }, [addHistoricalData, currentBlockNumber])
}
