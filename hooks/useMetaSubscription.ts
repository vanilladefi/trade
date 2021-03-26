import { MetaSubscription, thegraphClientSub } from 'lib/graphql'
import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { currentBlockNumberState } from 'state/meta'
import type { MetaQueryResponse } from 'types/trade'

interface subReturnValue {
  data: MetaQueryResponse
}

export default function useMetaSubscription(): void {
  const setCurrentBlockNumber = useSetRecoilState(currentBlockNumberState)

  useEffect(() => {
    const subMeta = thegraphClientSub
      .request({ query: MetaSubscription })
      .subscribe({
        next: ({ data }: subReturnValue) =>
          setCurrentBlockNumber(data?._meta.block.number),
      })

    return () => {
      subMeta.unsubscribe()
    }
  }, [setCurrentBlockNumber])
}
