interface PairInfo {
  pairId: string | null
  token: {
    address: string
    symbol: string
  }
}

interface UniSwapToken {
  [index: string]: string | number | null
  name: string
  address: string
  symbol: string
  decimals: number
  chainId: number
  logoURI: string
}

interface Token extends UniSwapToken {
  pairId: string | null
  price: number | null
  priceChange: number | null
  liquidity: number | null
  logoColor: string | null
}

interface TokenInfoQueryResponse {
  id: string
  token: {
    id: string
  }
  price: string
  reserveUSD: string
}

interface PairByIdQueryResponse {
  id: string
  token0: {
    id: string
    symbol: string
  }
  token1: {
    id: string
    symbol: string
  }
}

type HandleTradeClick = (pairInfo: PairInfo) => void
