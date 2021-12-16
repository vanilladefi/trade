import { getAverageBlockCountPerHour } from 'lib/block'
import { getTheGraphClient, UniswapVersion, v2, v3 } from 'lib/graphql'
import { addData, addGraphInfo, getTokenInfoQueryVariables } from 'lib/tokens'
import { useEffect } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { currentBlockNumberState, currentETHPrice } from 'state/meta'
import { uniswapV2TokenState, uniswapV3TokenState } from 'state/tokens'
import useSWR from 'swr'
import { VanillaVersion } from 'types/general'
import type { TokenInfoQueryResponse } from 'types/trade'

export default function useTokenSubscription(version: VanillaVersion): void {
  const currentBlockNumber = useRecoilValue(currentBlockNumberState)
  const ethPrice = useRecoilValue(currentETHPrice)
  const uniswapVersion =
    version === VanillaVersion.V1_0 ? UniswapVersion.v2 : UniswapVersion.v3
  const variables = getTokenInfoQueryVariables(version)
  const { http } = getTheGraphClient(uniswapVersion)
  const TokenInfoQuery =
    version === VanillaVersion.V1_0 ? v2.TokenInfoQuery : v3.TokenInfoQuery
  const { data, error } = useSWR([TokenInfoQuery, variables], http?.request)

  const handleNewData = useRecoilCallback(
    ({ set }) =>
      async (data: TokenInfoQueryResponse[]) => {
        if (data?.length && ethPrice > 0) {
          set(
            version === VanillaVersion.V1_0
              ? uniswapV2TokenState
              : uniswapV3TokenState,
            (tokens) => addData(uniswapVersion, tokens, data, false, ethPrice),
          )
        }
      },
    [],
  )

  const addHistoricalData = useRecoilCallback(
    ({ snapshot, set }) =>
      async (blockNumber: number) => {
        const tokens = await snapshot.getPromise(
          uniswapVersion === UniswapVersion.v2
            ? uniswapV2TokenState
            : uniswapV3TokenState,
        )
        if (blockNumber > 0 && tokens?.length && ethPrice > 0) {
          set(
            uniswapVersion === UniswapVersion.v2
              ? uniswapV2TokenState
              : uniswapV3TokenState,
            await addGraphInfo(uniswapVersion, tokens, blockNumber, ethPrice),
          )
        }
      },
    [],
  )

  useEffect(() => {
    if (!error && data && (data as any) && (data as TokenInfoQueryResponse[])) {
      const tokenInfoQueryResponse = data as TokenInfoQueryResponse[]
      handleNewData(tokenInfoQueryResponse)
    } else {
      console.error(error)
    }
  }, [data, error, handleNewData])

  // Handle price change fetching
  useEffect(() => {
    getAverageBlockCountPerHour().then((blocksPerHour) => {
      addHistoricalData(currentBlockNumber - 24 * blocksPerHour)
    })
  }, [addHistoricalData, currentBlockNumber])
}
