import { getTheGraphClient, UniswapVersion, v2, v3 } from 'lib/graphql'
import { useEffect } from 'react'
import { useRecoilCallback } from 'recoil'
import { currentETHPrice } from 'state/meta'
import useSWR from 'swr'

export interface ETHPriceQueryResponse {
  bundle: {
    ethPrice: string
  }
}

function useETHPrice(version: UniswapVersion): void {
  const query = version === UniswapVersion.v2 ? v2.ETHPrice : v3.ETHPrice
  const { http } = getTheGraphClient(version)
  const { data, error } = useSWR(query, http?.request, {
    refreshInterval: 5000,
  })

  const handleNewData = useRecoilCallback(
    ({ set }) =>
      (data: ETHPriceQueryResponse) => {
        const ethPrice = parseFloat(data?.bundle?.ethPrice)
        if (ethPrice !== undefined && ethPrice !== null && ethPrice > 0) {
          set(currentETHPrice, ethPrice)
        }
      },
    [],
  )

  useEffect(() => {
    if (!error && data && (data as ETHPriceQueryResponse)) {
      const ethPriceQueryResponse = data as ETHPriceQueryResponse
      handleNewData(ethPriceQueryResponse)
    } else {
      console.error('ETHPriceQuery SWR failed!', error)
    }
  }, [data, error, handleNewData])
}

export default useETHPrice
