import type { Column } from 'react-table'
import type { BreakPointOptions } from 'components/GlobalStyles/Breakpoints'

export interface PairInfo {
  pairId: string | null
  token: {
    address: string
    symbol: string
  }
}

export interface UniSwapToken {
  [index: string]: string | number | null
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

export interface TokenInfoQueryResponse {
  pairId: string
  token: {
    id: string
  }
  price: string
  reserveUSD: string
}

export interface PairByIdQueryResponse {
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

export type HandleBuyClick = (pairInfo: PairInfo) => void

export type HandleSellClick = (pairInfo: PairInfo) => void

export type LeftOrRightAlignable = { align?: 'left' | 'right' }

export type ResponsivelyHidable = {
  hideBelow?: keyof BreakPointOptions
  hideAbove?: keyof BreakPointOptions
}

export type ListColumn<T extends Record<string, unknown>> = Column<T> &
  LeftOrRightAlignable &
  ResponsivelyHidable
