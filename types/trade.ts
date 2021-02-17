import type { BreakPointOptions } from 'components/GlobalStyles/Breakpoints'
import type { Column } from 'react-table'

export interface PairInfo {
  pairId: string | null
}

export interface UniSwapToken {
  [index: string]: string | number | null | undefined
  name?: string
  address: string
  symbol?: string
  decimals: number
  chainId: number
  logoURI?: string
}

export interface Token extends UniSwapToken {
  pairId: string | null
  price: number | null
  priceHistorical: number | null
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
    decimals: string
  }
  token1: {
    id: string
    symbol: string
    decimals: string
  }
}

export interface MetaQueryResponse {
  _meta: {
    block: {
      hash: string
      number: number
    }
    deployment: string
  }
}

export type HandleBuyClick = (pairInfo: PairInfo) => void

export type HandleSellClick = (pairInfo: PairInfo) => void

export type LeftOrRightAlignable = { align?: 'left' | 'right' }

export type ResponsivelyHidable = {
  hideBelow?: keyof BreakPointOptions
  hideAbove?: keyof BreakPointOptions
}

export type ColorBasedOnValue = { colorBasedOnValue?: boolean }

export type ListColumn<T extends Record<string, unknown>> = Column<T> &
  LeftOrRightAlignable &
  ResponsivelyHidable &
  ColorBasedOnValue
