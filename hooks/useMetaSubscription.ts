import {
  getTheGraphClient,
  MetaSubscription,
  UniswapVersion,
} from 'lib/graphql'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { currentBlockNumberState } from 'state/meta'
import type { MetaQueryResponse } from 'types/trade'

interface subReturnValue {
  data: MetaQueryResponse
}

export default function useMetaSubscription(): void {
  const [currentBlockNumber, setCurrentBlockNumber] = useRecoilState(
    currentBlockNumberState,
  )

  useEffect(() => {
    const { ws } = getTheGraphClient(UniswapVersion.v2)
    const subMeta = ws.request({ query: MetaSubscription }).subscribe({
      next: ({ data }: subReturnValue) =>
        data?._meta.block.number > currentBlockNumber &&
        setCurrentBlockNumber(data?._meta.block.number),
    })

    return () => {
      subMeta.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCurrentBlockNumber])
}
