import type { ListColumn, Token } from 'types/trade'
import * as Cells from './Cells'

export const LogoTicker: ListColumn<Token> = {
  id: 'logoTicker',
  Header: 'Token',
  accessor: 'symbol',
  sortType: 'basic',
  hideAbove: 'md',
  Cell: Cells.TokenLogo,
}

export const LogoName: ListColumn<Token> = {
  id: 'logoName',
  Header: 'Token',
  accessor: 'name',
  hideBelow: 'md',
  width: 3,
  Cell: Cells.TokenLogo,
}

export const Ticker: ListColumn<Token> = {
  id: 'ticker',
  Header: 'Ticker',
  accessor: 'symbol',
  width: 1,
  sortType: 'basic',
  hideBelow: 'md',
}

export const Price: ListColumn<Token> = {
  id: 'price',
  Header: 'Price',
  accessor: 'priceUSD',
  width: 3,
  sortDescFirst: true,
  sortType: 'basic',
  disableGlobalFilter: true,
  align: 'right',
  Cell: Cells.ValueUSD,
}

export const Liquidity: ListColumn<Token> = {
  id: 'liquidity',
  Header: 'Liquidity',
  accessor: 'liquidity',
  hideBelow: 'md',
  sortDescFirst: true,
  sortType: 'basic',
  disableGlobalFilter: true,
  align: 'right',
  Cell: Cells.ValueUSD,
}

export const PriceChange: ListColumn<Token> = {
  id: 'priceChange',
  Header: 'Price Change in ETH (24h) %',
  accessor: 'priceChange',
  sortDescFirst: true,
  disableGlobalFilter: true,
  sortType: 'basic',
  align: 'right',
  colorBasedOnValue: true,
  Cell: Cells.ValuePercent,
}

export const OwnedAmount: ListColumn<Token> = {
  id: 'owned',
  Header: 'Amount',
  accessor: 'owned',
  width: 1,
  sortDescFirst: true,
  sortType: 'basic',
  disableGlobalFilter: true,
  align: 'right',
  Cell: Cells.ValueDecimal,
}

export const MarketValue: ListColumn<Token> = {
  id: 'value',
  Header: 'Market value',
  accessor: 'value',
  sortDescFirst: true,
  sortType: 'basic',
  disableGlobalFilter: true,
  align: 'right',
  hideBelow: 'md',
  Cell: Cells.ValueUSD,
}

export const Profit: ListColumn<Token> = {
  id: 'profit',
  Header: 'Profit in ETH %',
  accessor: 'profit',
  width: 1,
  sortDescFirst: true,
  sortType: 'basic',
  disableGlobalFilter: true,
  align: 'right',
  Cell: Cells.ValuePercent,
}

export const UnrealizedVNL: ListColumn<Token> = {
  id: 'vnl',
  Header: 'Unrealized VNL',
  accessor: 'vnl',
  width: 1,
  sortDescFirst: true,
  sortType: 'basic',
  disableGlobalFilter: true,
  align: 'right',
  hideBelow: 'md',
  Cell: Cells.UnrealizedVnl,
}

export const Eligibility: ListColumn<Token> = {
  id: 'eligible',
  Header: 'Profit Mining',
  accessor: 'eligible',
  width: 1,
  sortType: 'basic',
  align: 'right',
  Cell: Cells.ProfitMining,
}
