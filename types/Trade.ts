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
  logoURI: string
}

export type TokenPriced = {
  price: number
  priceChange: number
  liquidity: number
}

export type TokenGradient = {
  gradient: string
}

export type Token = UniSwapToken & Partial<TokenPriced> & Partial<TokenGradient>
