import { CurrencyAmount, Percent, Price, TradeType } from '@uniswap/sdk-core'
import type { BreakPointOptions } from 'components/GlobalStyles/Breakpoints'
import { BigNumber, ethers } from 'ethers'
import type { Column } from 'react-table'

export interface PairInfo {
  pairId: string | null
  feeTier?: string | number | null
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
  symbol: string
  decimals: string
  chainId: string
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
  reserveETH?: string | null
  reserveToken?: string | null
  inRangeLiquidity?: string | null
  sqrtPrice?: string | null
  pool?: string | null
  fee?: string | number | null
  observationCardinality?: number | null
}

export interface TokenInfoQueryResponse {
  token: {
    id: string
  }
  price: string
  pairId?: string
  id?: string
  reserveETH?: string
  reserveToken?: string
  reserveUSD?: string
  liquidity?: string
  inRangeLiquidity?: string | null
  sqrtPrice?: string | null
  totalValueLockedETH?: string | null
}

/**
 * Currently token1 is always ETH(WETH)
 */
export interface PairByIdQueryResponse {
  id: string
  token0: Token
  token1: Token
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
  CONVERSION = 'conversion',
}

export interface TransactionDetails {
  hash: string
  action: Action
  approval?: { tokenAddress: string; spender: string }
  receipt?: ethers.providers.TransactionReceipt
  from: string
  blockNumber?: number
  paid?: Token
  received?: Token
  amountConverted?: string
  amountApproved?: string
  amountPaid?: string
  amountReceived?: string
  addedTime?: number
  reward?: string
  pairId?: string
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

export declare class V3Trade {
  get executionPrice(): Price
  minimumAmountOut(slippageTolerance: Percent): CurrencyAmount
  maximumAmountIn(slippageTolerance: Percent): CurrencyAmount
  inputAmount: CurrencyAmount
  outputAmount: CurrencyAmount
  route: null
  price: Price
  tradeType: TradeType
  worstExecutionPrice: () => Price
}

export interface TokenPriceResponse {
  ethSum: BigNumber
  latestBlock: BigNumber
  tokenSum: BigNumber
  weightedBlockSum: BigNumber
}

export interface TradeResult {
  price: BigNumber
  twapPeriodInSeconds: BigNumber
  profitablePrice: BigNumber
  maxProfitablePrice: BigNumber
  rewardableProfit: BigNumber
  reward: BigNumber
}

export interface RewardEstimate {
  low: TradeResult
  medium: TradeResult
  high: TradeResult
}

export interface RewardResponse {
  avgBlock: BigNumber
  htrs: BigNumber
  profitablePrice?: BigNumber
  vpc?: BigNumber
  reward?: BigNumber
  estimate?: RewardEstimate
}
