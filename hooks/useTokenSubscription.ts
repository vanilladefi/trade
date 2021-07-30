import { getAverageBlockCountPerHour } from 'lib/block'
import { getTheGraphClient, UniswapVersion, v2, v3 } from 'lib/graphql'
import { addData, addGraphInfo, getAllTokens, weth } from 'lib/tokens'
import { useEffect } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { currentBlockNumberState, currentETHPrice } from 'state/meta'
import { uniswapV2TokenState, uniswapV3TokenState } from 'state/tokens'
import { VanillaVersion } from 'types/general'
import type { TokenInfoQueryResponse } from 'types/trade'

const getVariables = (version: VanillaVersion) => {
  const allTokens = getAllTokens(version)
  let variables = {
    weth: weth.address.toLowerCase(),
    tokenAddresses: allTokens.map(({ address }) => address.toLowerCase()),
  }
  if (version === VanillaVersion.V1_1) {
    variables = {
      feeTiers: allTokens.map(({ feeTier }) => feeTier),
      ...variables,
    }
  }
  return variables
}

interface subReturnValue {
  data: { tokens: TokenInfoQueryResponse[] }
}

export default function useTokenSubscription(version: VanillaVersion): void {
  const currentBlockNumber = useRecoilValue(currentBlockNumberState)
  const ethPrice = useRecoilValue(currentETHPrice)
  const uniswapVersion =
    version === VanillaVersion.V1_0 ? UniswapVersion.v2 : UniswapVersion.v3

  const TokenInfoSubAB =
    version === VanillaVersion.V1_0 ? v2.TokenInfoSubAB : v3.TokenInfoSubAB
  const TokenInfoSubBA =
    version === VanillaVersion.V1_0 ? v2.TokenInfoSubBA : v3.TokenInfoSubBA

  const handleNewData = useRecoilCallback(
    ({ set }) =>
      async ({ data }: subReturnValue) => {
        if (data?.tokens?.length && ethPrice > 0) {
          set(
            version === VanillaVersion.V1_0
              ? uniswapV2TokenState
              : uniswapV3TokenState,
            (tokens) =>
              addData(uniswapVersion, tokens, data.tokens, false, ethPrice),
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
    const subOptions = {
      next: handleNewData,
    }

    const variables = getVariables(version)

    const { ws } = getTheGraphClient(uniswapVersion)

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
  }, [TokenInfoSubAB, TokenInfoSubBA, handleNewData, uniswapVersion, version])

  // Handle price change fetching
  useEffect(() => {
    getAverageBlockCountPerHour().then((blocksPerHour) => {
      addHistoricalData(currentBlockNumber - 24 * blocksPerHour)
    })
  }, [addHistoricalData, currentBlockNumber])
}
