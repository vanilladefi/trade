export type PairInfo = {
  pairId: string | null
  token: {
    address: string
    symbol: string
  }
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

export type TokenPair = {
  pairId: string | null
}

export type TokenPriced = {
  price: number | null
  priceChange: number | null
  liquidity: number | null
}

export type TokenGradient = {
  gradient: string | null
}

export type Token = UniSwapToken & TokenPair & TokenPriced & TokenGradient

export type TokenNumberFields =
  | 'decimals'
  | 'chainId'
  | 'price'
  | 'liquidity'
  | 'priceChange'
