import { getTheGraphClient, UniswapVersion, v2, v3 } from 'lib/graphql'
import { useEffect } from 'react'
import { useRecoilCallback } from 'recoil'
import { currentETHPrice } from 'state/meta'

export interface ETHPriceQueryResponse {
  bundle: {
    ethPrice: string
  }
}

export interface ETHPriceSubResponse {
  data: {
    bundle: {
      ethPrice: string
    }
  }
}

function useETHPrice(version: UniswapVersion): void {
  const query = version === UniswapVersion.v2 ? v2.ETHPriceSub : v3.ETHPriceSub

  const handleNewData = useRecoilCallback(
    ({ set }) => ({ data }: ETHPriceSubResponse) => {
      const ethPrice = parseFloat(data?.bundle?.ethPrice)
      if (ethPrice !== undefined && ethPrice !== null && ethPrice > 0) {
        set(currentETHPrice, ethPrice)
      }
    },
    [],
  )

  useEffect(() => {
    const subOptions = {
      next: handleNewData,
    }
    const { ws } = getTheGraphClient(version)
    const ethPriceSub = ws.request({ query: query }).subscribe(subOptions)
    return () => {
      ethPriceSub.unsubscribe()
    }
  }, [handleNewData, query, version])
}

export default useETHPrice
