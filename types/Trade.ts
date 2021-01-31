export type PairInfo = {
  pairId: string | null
  token: {
    address: string
    symbol: string
  }
}

export type HandleTradeClick = (pairInfo: PairInfo) => void

export interface UniSwapToken {
  name: string
  address: string
  symbol: string
  decimals: number
  chainId: number
  logoURI: string
}

export interface Token extends UniSwapToken {
  pairId: string | null
  price: number | null
  priceChange: number | null
  liquidity: number | null
  logoColor: string | null
}
