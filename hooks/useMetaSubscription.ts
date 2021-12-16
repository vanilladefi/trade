import { getTheGraphClient, MetaQuery, UniswapVersion } from 'lib/graphql'
import { useCallback, useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { currentBlockNumberState } from 'state/meta'
import useSWR from 'swr'
import { VanillaVersion } from 'types/general'
import type { MetaQueryResponse } from 'types/trade'

export default function useMetaSubscription(version: VanillaVersion): void {
  const setCurrentBlockNumber = useSetRecoilState(currentBlockNumberState)

  const getUsedUniswapVersion = useCallback(() => {
    let usedUniswapVersion
    switch (version) {
      case VanillaVersion.V1_0:
        usedUniswapVersion = UniswapVersion.v2
        break
      case VanillaVersion.V1_1:
        usedUniswapVersion = UniswapVersion.v3
        break
      default:
        usedUniswapVersion = UniswapVersion.v3
    }
    return usedUniswapVersion
  }, [version])

  const { http } = getTheGraphClient(getUsedUniswapVersion())
  const { data, error } = useSWR(MetaQuery, http?.request, {
    refreshInterval: 5000,
  })

  useEffect(() => {
    if (!error && data && (data as MetaQueryResponse)) {
      const metaQueryResponse = data as MetaQueryResponse
      setCurrentBlockNumber(metaQueryResponse?._meta.block.number)
    } else {
      console.error('MetaQuery SWR failed!', error)
    }
  }, [data, error, setCurrentBlockNumber])
}
