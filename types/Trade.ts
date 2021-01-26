export type PairInfo = {
  token0: string
  token1: string
}

export type HandleTradeClick = (pairInfo: PairInfo) => void
