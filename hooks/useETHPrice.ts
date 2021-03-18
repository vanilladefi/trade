import { ETHPriceSub, thegraphClientSub } from 'lib/graphql'
import { useRecoilCallback } from 'recoil'
import { currentETHPrice } from 'state/meta'

interface ETHPriceResponse {
  data: {
    bundle: {
      ethPrice: string
    }
  }
}

function useETHPrice(): void {
  const handleNewData = useRecoilCallback(
    ({ set }) => ({ data }: ETHPriceResponse) => {
      if (data?.bundle?.ethPrice) {
        set(currentETHPrice, data.bundle.ethPrice)
      }
    },
    [],
  )
  const subOptions = {
    next: handleNewData,
  }
  thegraphClientSub.request({ query: ETHPriceSub }).subscribe(subOptions)
}

export default useETHPrice
