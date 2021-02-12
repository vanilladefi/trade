import { useEffect } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { thegraphClientSub, TokenInfoSubAB, TokenInfoSubBA } from 'lib/graphql'
import {
  getAllTokens,
  addData,
  addGraphInfo,
  WETH,
  weth,
  chainId,
} from 'lib/tokens'
import { getAverageBlockCountPerHour } from 'lib/block'
import { allTokensStoreState } from 'state/tokens'
import { currentBlockNumberState } from 'state/meta'
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
  const currentBlockNumber = useRecoilValue(currentBlockNumberState)

  const handleNewData = useRecoilCallback(
    ({ set }) => ({ data }: subReturnValue) => {
      if (data?.tokens?.length) {
        set(allTokensStoreState, (tokens) => addData(tokens, data.tokens))
      }
    },
    [],
  )

  const addHistoricalData = useRecoilCallback(
    ({ snapshot, set }) => async (blockNumber: number) => {
      const tokens = await snapshot.getPromise(allTokensStoreState)
      if (blockNumber > 0 && tokens?.length) {
        set(allTokensStoreState, await addGraphInfo(tokens, blockNumber))
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
