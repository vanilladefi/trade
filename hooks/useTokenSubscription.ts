import { getAverageBlockCountPerHour } from 'lib/block'
import { getTheGraphClient, UniswapVersion, v2, v3 } from 'lib/graphql'
import { addData, addGraphInfo, getAllTokens, weth } from 'lib/tokens'
import { useEffect } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { currentBlockNumberState, currentETHPrice } from 'state/meta'
import { uniswapV2TokenState, uniswapV3TokenState } from 'state/tokens'
import type { TokenInfoQueryResponse } from 'types/trade'

const variables = {
  weth: weth.address.toLowerCase(),
  tokenAddresses: getAllTokens().map(({ address }) => address.toLowerCase()),
}

interface subReturnValue {
  data: { tokens: TokenInfoQueryResponse[] }
}

export default function useTokenSubscription(
  version: UniswapVersion = UniswapVersion.v3,
): void {
  const currentBlockNumber = useRecoilValue(currentBlockNumberState)
  const ethPrice = useRecoilValue(currentETHPrice)

  const TokenInfoSubAB =
    version === UniswapVersion.v2 ? v2.TokenInfoSubAB : v3.TokenInfoSubAB
  const TokenInfoSubBA =
    version === UniswapVersion.v2 ? v2.TokenInfoSubBA : v3.TokenInfoSubBA

  const handleNewData = useRecoilCallback(
    ({ set }) => async ({ data }: subReturnValue) => {
      console.log(data)
      if (data?.tokens?.length && ethPrice > 0) {
        set(
          version === UniswapVersion.v2
            ? uniswapV2TokenState
            : uniswapV3TokenState,
          (tokens) => addData(version, tokens, data.tokens, false, ethPrice),
        )
      }
    },
    [],
  )

  const addHistoricalData = useRecoilCallback(
    ({ snapshot, set }) => async (blockNumber: number) => {
      const tokens = await snapshot.getPromise(
        version === UniswapVersion.v2
          ? uniswapV2TokenState
          : uniswapV3TokenState,
      )
      if (blockNumber > 0 && tokens?.length && ethPrice > 0) {
        console.log(tokens)
        set(
          version === UniswapVersion.v2
            ? uniswapV2TokenState
            : uniswapV3TokenState,
          await addGraphInfo(version, tokens, blockNumber, ethPrice),
        )
      }
    },
    [],
  )

  useEffect(() => {
    const subOptions = {
      next: handleNewData,
    }

    const { ws } = getTheGraphClient(version)

    const subAB = ws
      ?.request({
        query: TokenInfoSubAB,
        variables,
      })
      .subscribe(subOptions)

    const subBA = ws
      ?.request({
        query: TokenInfoSubBA,
        variables,
      })
      .subscribe(subOptions)

    return () => {
      subAB?.unsubscribe()
      subBA?.unsubscribe()
    }
  }, [TokenInfoSubAB, TokenInfoSubBA, handleNewData, version])

  // Handle price change fetching
  useEffect(() => {
    getAverageBlockCountPerHour().then((blocksPerHour) => {
      addHistoricalData(currentBlockNumber - 24 * blocksPerHour)
    })
  }, [addHistoricalData, currentBlockNumber])
}
