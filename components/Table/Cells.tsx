import Image from 'next/image'
import type { CellProps } from 'react-table'
import { Eligibility, Token } from 'types/trade'

export function TokenLogo({ value, row }: CellProps<Token>): JSX.Element {
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
  return (
    <div className='container'>
      <div className='logo-wrapper'>{Logo}</div>
      <div className='value-wrapper'>{String(value)}</div>
      <style jsx>{`
        div.container {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        div.logo-wrapper {
          width: 30px;
          height: 30px;
          margin-right: 1rem;
          border-radius: 100%;
          overflow: hidden;
          display: none;
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
  return (value ?? 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
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
  return value === Eligibility.Eligible ? (
    <div style={{ color: '#3B870C' }}>Yes</div>
  ) : (
    <div style={{ color: '#C30936' }}>No</div>
  )
}
