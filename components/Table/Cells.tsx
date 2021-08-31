import Image from 'next/image'
import { MouseEvent, useCallback } from 'react'
import type { CellProps } from 'react-table'
import { Eligibility, Liquidity, Token } from 'types/trade'

const warnSrc = '/images/icons/liq-warning-orange.svg'
const alertSrc = '/images/icons/liq-warning-red.svg'

type TokenLogoProps = CellProps<Token> & {
  liquidityWarning?: boolean
  openLiquidityModal?: (liquidity: Liquidity) => void
  openCardinalityModal?: () => void
}

export function TokenLogo({
  value,
  row,
  liquidityWarning,
  openLiquidityModal,
  openCardinalityModal,
}: TokenLogoProps): JSX.Element {
  const imgSrc = row.original.logoURI || null
  const Logo = imgSrc ? (
    <Image
      src={imgSrc}
      height='30px'
      width='30px'
      layout='fixed'
      alt={String(value)}
      aria-hidden='true'
    />
  ) : null

  // Uniswap v2 liquidity warnings
  const liquidity = row?.original?.reserve
    ? row?.original?.reserve < Liquidity.LOW
      ? Liquidity.LOW
      : row?.original?.reserve < Liquidity.MEDIUM
      ? Liquidity.MEDIUM
      : Liquidity.HIGH
    : Liquidity.LOW
  const warningSrc: false | string =
    (liquidityWarning && row?.original?.reserve) ||
    row?.original?.symbol === 'AMPL'
      ? liquidity === Liquidity.LOW
        ? alertSrc
        : liquidity === Liquidity.MEDIUM
        ? warnSrc
        : false
      : false
  const LiquidityWarning = warningSrc ? (
    <Image
      src={warningSrc}
      height='20px'
      width='20px'
      layout='fixed'
      alt='liquidityWarning'
      aria-hidden='false'
    />
  ) : null

  // Uniswap v3 oracle observing cardinality
  const observationCardinality = row?.original?.observationCardinality
  const CardinalityWarning =
    observationCardinality && observationCardinality === 1 ? (
      <Image
        src={alertSrc}
        height='20px'
        width='20px'
        layout='fixed'
        alt='liquidityWarning'
        aria-hidden='false'
      />
    ) : null

  const clickHandler = useCallback(
    (e: MouseEvent): void => {
      if (
        liquidityWarning &&
        openLiquidityModal &&
        row?.original?.symbol !== 'AMPL'
      ) {
        e.stopPropagation()
        openLiquidityModal(liquidity)
      }
      if (
        observationCardinality &&
        observationCardinality === 1 &&
        openCardinalityModal
      ) {
        e.stopPropagation()
        openCardinalityModal()
      }
    },
    [
      liquidity,
      liquidityWarning,
      observationCardinality,
      openCardinalityModal,
      openLiquidityModal,
      row?.original?.symbol,
    ],
  )

  return (
    <div
      className={`container${
        warningSrc || (observationCardinality && observationCardinality === 1)
          ? ' warning'
          : ''
      }`}
      onClick={clickHandler}
    >
      <div className='logo-wrapper'>
        <div className='inner-logo-wrapper'>{Logo}</div>
        {liquidityWarning && (
          <div className='warning-wrapper'>{LiquidityWarning}</div>
        )}
        {observationCardinality && observationCardinality === 1 && (
          <div
            className='warning-wrapper'
            title="Price oracle's observation cardinality 1. Click for more info."
          >
            {CardinalityWarning}
          </div>
        )}
      </div>
      <div className='value-wrapper'>{String(value)}</div>
      <style jsx>{`
        div.container {
          display: flex;
          flex-direction: row;
          align-items: center;
          position: relative;
        }
        div.container.warning {
          cursor: pointer;
        }
        div.logo-wrapper {
          width: 30px;
          height: 30px;
          margin-right: 1rem;
          display: none;
          position: relative;
        }
        div.inner-logo-wrapper {
          display: flex;
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 100%;
          overflow: hidden;
        }
        div.warning-wrapper {
          position: absolute;
          z-index: 2;
          display: flex;
          width: max-content;
          height: max-content;
          top: -4px;
          right: -8px;
        }
        @media (min-width: 370px) {
          div.logo-wrapper {
            display: inline-block;
          }
        }
      `}</style>
    </div>
  )
}

export function ValueETH(props: CellProps<Token>): React.ReactNode {
  return ValueDecimal(props) + ' ETH'
}

export function ValueUSD({ value }: CellProps<Token>): React.ReactNode {
  let localeString = (value ?? 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  if (value < 0.01) {
    localeString = '<$0.01'
  }
  return localeString
}

export function ValueUSDHighlighted({
  value,
}: CellProps<Token>): React.ReactNode {
  return (
    <b>
      {(value ?? 0).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </b>
  )
}

export function ValueDecimal({ value }: CellProps<Token>): React.ReactNode {
  return (value ?? 0).toLocaleString('en-US', {
    style: 'decimal',
    maximumFractionDigits: 10, // TODO
  })
}

export function ValuePercent({ value }: CellProps<Token>): React.ReactNode {
  return (value ?? 0).toLocaleString('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    signDisplay: 'always',
  })
}

export function UnrealizedVnl({
  value,
  row,
}: CellProps<Token>): React.ReactNode {
  return row.original.eligible ? (
    value.toLocaleString('en-US', {
      style: 'decimal',
      maximumFractionDigits: 10, // TODO
    })
  ) : (
    <i>{'Not eligible'}</i>
  )
}

export function ProfitMining({ value }: CellProps<Token>): React.ReactNode {
  return value === Eligibility.Eligible ? 'Yes' : 'No'
}
