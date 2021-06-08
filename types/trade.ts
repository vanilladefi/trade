import type { BreakPointOptions } from 'components/GlobalStyles/Breakpoints'
import { ethers } from 'ethers'
import type { Column } from 'react-table'

export interface PairInfo {
  pairId: string | null
}

export enum Operation {
  Buy = 'buy',
  Sell = 'sell',
}

export enum Eligibility {
  NotEligible,
  Eligible,
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
  price?: number | null
  priceUSD?: number | null
  priceHistorical?: number | null
  priceChange?: number | null
  liquidity?: number | null
  logoColor: string | null
  owned?: string | null
  ownedRaw?: string | null
  value?: number | null
  profit?: number | string | null
  vnl?: number | null
  eligible?: Eligibility
  vpc?: string | null
  htrs?: string | null
  reserve?: string | number | null
}

export interface TokenInfoQueryResponse {
  pairId: string
  token: {
    id: string
  }
  price: string
  reserve: string
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

export interface Call {
  address: string
  callData: string
}

export enum Action {
  PURCHASE = 'purchase',
  SALE = 'sale',
  APPROVAL = 'approval',
}

export interface TransactionDetails {
  hash: string
  action: Action
  approval?: { tokenAddress: string; spender: string }
  receipt?: ethers.providers.TransactionReceipt
  from: string
  blockNumber?: number
  paid?: UniSwapToken
  received?: UniSwapToken
  amountPaid?: string
  amountReceived?: string
  addedTime?: number
  reward?: string
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

export enum Liquidity {
  LOW = 500,
  MEDIUM = 1000,
  HIGH = 2000,
}
