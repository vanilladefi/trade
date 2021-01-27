import { AnimatePresence } from 'framer-motion'
import React, { useEffect } from 'react'
import { ColumnWithStrictAccessor, Row, useTable } from 'react-table'
import { useIsSmallerThan } from '../hooks/breakpoints'
import { breakPointOptions } from './GlobalStyles/Breakpoints'

export type TokenInfo = {
  imageUrl: string
  name: string
  ticker: string
  price: string
  token0: string
  token1: string
  marketCap?: string
  liquidity: string
  priceChange: string
  gradient?: string
  buy?: boolean
}

export type ColumnWithHide<
  T extends TokenInfo
> = ColumnWithStrictAccessor<T> & {
  hideBelow?: string
  align?: string
}

type Props = {
  data: TokenInfo[]
  columns: ColumnWithHide<TokenInfo>[]
}

export default function TokenList({ data, columns }: Props): JSX.Element {
  const isSmallerThan = useIsSmallerThan()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setHiddenColumns,
  } = useTable({
    columns,
    data,
    initialState: {
      hiddenColumns: getHiddenColumns(columns, isSmallerThan),
    },
  })

  useEffect(() => {
    setHiddenColumns(getHiddenColumns(columns, isSmallerThan))
  }, [columns, isSmallerThan, setHiddenColumns])

  return (
    <AnimatePresence>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={`headerGroup-${headerGroup.id}`}
            >
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} key={`th-${column.id}`}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <tr
                {...row.getRowProps(() => getRowProps(row))}
                key={`tr-${row.id}`}
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} key={`td-${cell.column.id}`}>
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
        <style jsx>{`
          table {
            border-collapse: separate;
            table-layout: auto;
            width: calc(100% + 2rem);
            margin-left: -1rem;
            margin-right: -1rem;
            font-family: var(--bodyfont);
            font-size: var(--bodysize);
            border-spacing: 0 13px;
            margin-top: -13px;
            --buttonmargin: 0;
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
    </AnimatePresence>
  )
}

const getHiddenColumns = (
  columns: ColumnWithHide<TokenInfo>[],
  isSmallerThan: breakPointOptions
): string[] =>
  columns
    .filter(
      (column) =>
        column.id &&
        column.hideBelow &&
        isSmallerThan[column.hideBelow as keyof breakPointOptions]
    )
    .map((column) => column?.id ?? '')

const getRowProps = (row: Row<TokenInfo>) => {
  if (row.original.gradient) {
    return {
      style: {
        background: row.original.gradient,
        backgroundRepeat: 'no-repeat',
      },
    }
  } else {
    return {}
  }
}
