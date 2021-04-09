import { ETHPriceSub, thegraphClientSub } from 'lib/graphql'
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

function useETHPrice(): void {
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
    const ethPriceSub = thegraphClientSub
      .request({ query: ETHPriceSub })
      .subscribe(subOptions)
    return () => {
      ethPriceSub.unsubscribe()
    }
  }, [handleNewData])
}

export default useETHPrice
