import Image from 'next/image'
import type { CellProps } from 'react-table'
import type { Token } from 'types/trade'

export function TokenLogo({ value, row }: CellProps<Token>): JSX.Element {
  const imgSrc = row.original.logoURI || null
  const Logo = imgSrc ? (
    <Image src={imgSrc} height='30px' width='30px' layout='fixed' />
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
    signDisplay: 'always',
  })
}
