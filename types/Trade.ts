export type PairInfo = {
  token0: string
  token1: string
}

export type HandleTradeClick = (pairInfo: PairInfo) => void

export type UniSwapToken = {
  name: string
  address: string
  symbol: string
  decimals: number
  chainId: number
  logoURI?: string
}

export type TokenPriced = {
  price: number | null
  priceChange: number | null
  liquidity: number | null
}

export type TokenGradient = {
  gradient: string | null
}

export type Token = UniSwapToken & TokenPriced & TokenGradient
