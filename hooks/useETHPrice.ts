import { ETHPriceSub, thegraphClientSub } from 'lib/graphql'
import { useEffect } from 'react'
import { useRecoilCallback } from 'recoil'
import { currentETHPrice } from 'state/meta'

export interface ETHPriceResponse {
  data: {
    bundle: {
      ethPrice: string
    }
  }
}

function useETHPrice(): void {
  const handleNewData = useRecoilCallback(
    ({ set }) => ({ data }: ETHPriceResponse) => {
      if (
        data?.bundle?.ethPrice !== undefined &&
        data?.bundle?.ethPrice !== null &&
        Number(data?.bundle?.ethPrice) > 0
      ) {
        set(currentETHPrice, data.bundle.ethPrice)
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
