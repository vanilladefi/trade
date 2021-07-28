import {
  getTheGraphClient,
  MetaSubscription,
  UniswapVersion,
} from 'lib/graphql'
import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { currentBlockNumberState } from 'state/meta'
import { VanillaVersion } from 'types/general'
import type { MetaQueryResponse } from 'types/trade'

interface subReturnValue {
  data: MetaQueryResponse
}

export default function useMetaSubscription(version: VanillaVersion): void {
  const setCurrentBlockNumber = useSetRecoilState(currentBlockNumberState)

  useEffect(() => {
    let usedUniswapVersion: UniswapVersion
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

    const { ws } = getTheGraphClient(usedUniswapVersion)
    const subMeta = ws?.request({ query: MetaSubscription }).subscribe({
      next: ({ data }: subReturnValue) => {
        data?._meta.block.number &&
          setCurrentBlockNumber(data?._meta.block.number)
      },
    })

    return () => {
      subMeta?.unsubscribe()
    }
  }, [setCurrentBlockNumber, version])
}
