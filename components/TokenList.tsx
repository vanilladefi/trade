import React, { useEffect, useState } from 'react'
import { Column, Row, useTable } from 'react-table'
import useWindowWidthBreakpoints from 'use-window-width-breakpoints'
import { BreakPoint, breakPointOptions } from './GlobalStyles/Breakpoints'

export type TokenInfo = {
  imageUrl: string
  name: string
  ticker: string
  price: string
  token0: string
  token1: string
  marketCap: string
  liquidity: string
  priceChange: string
  gradient?: string
  buy?: boolean
}

export type ColumnWithHide<T extends TokenInfo> = Column<T> & {
  hideBelow?: string
}

export type Props = {
  data: TokenInfo[]
  columns: ColumnWithHide<TokenInfo>[]
}

//const beigeBackground = '#f3f1ea'

const TokenList = ({ data, columns }: Props): JSX.Element => {
  const breakpoint = useWindowWidthBreakpoints({
    xs: BreakPoint.xs,
    sm: BreakPoint.sm,
    md: BreakPoint.md,
    lg: BreakPoint.lg,
    xl: BreakPoint.xl,
  })

  const [hiddenColumns, setHiddenColumns] = useState<string[]>([])

  useEffect(() => {
    const hidden: string[] = []
    columns.forEach((column) => {
      if (
        column.id &&
        column.hideBelow &&
        breakpoint.down[column.hideBelow as keyof breakPointOptions]
      ) {
        hidden.push(column.accessor as string)
      }
    })
    setHiddenColumns(hidden)
  }, [data, columns])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    initialState: {
      hiddenColumns: hiddenColumns,
    },
  })

  const getRowProps = (row: Row<TokenInfo>) => {
    if (row.original.gradient) {
      return {
        style: {
          background: row.original.gradient,
        },
      }
    } else {
      return {}
    }
  }

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps(() => getRowProps(row))}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
      <style jsx>{`
        table {
          border-collapse: separate;
          table-layout: auto;
          width: calc(100% + 34px);
          margin-left: -1rem;
          margin-right: -1rem;
          font-family: var(--bodyfont);
          font-size: var(--bodysize);
          border-spacing: 0 13px;
          margin-top: -13px;
        }
        td,
        th {
          text-align: left;
          padding: var(--tablepadding);
          border-spacing: 13px 0;
        }
        th {
          font-weight: var(--theadweight);
          font-size: var(--smallsize);
          text-transform: uppercase;
          color: rgba(#2c1929, 0.6);
          padding: 0px 17px;
        }
        tbody tr {
          background: var(--beige);
        }
        tr td:first-of-type {
          border-top-left-radius: 9999px;
          border-bottom-left-radius: 9999px;
          padding-right: 0;
        }
        tr td:last-of-type {
          border-top-right-radius: 9999px;
          border-bottom-right-radius: 9999px;
          padding-right: 0;
        }
      `}</style>
    </table>
  )
}

export default TokenList
