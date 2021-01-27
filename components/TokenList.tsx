import Image from 'next/image'
import React, { useMemo, useEffect } from 'react'
import {
  Cell,
  ColumnWithStrictAccessor,
  TableRowProps,
  Row,
  useTable,
} from 'react-table'
import { useIsSmallerThan } from '../hooks/breakpoints'
import { breakPointOptions } from './GlobalStyles/Breakpoints'
import { HandleTradeClick } from 'types/Trade'
import Button, { ButtonColor } from './input/Button'

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

type TokenListProps = {
  tokenPairs: TokenInfo[]
  onTradeClick: HandleTradeClick
}

const rowProps = (
  props: Partial<TableRowProps>,
  { row }: { row: Row<TokenInfo> }
) => [
  props,
  {
    style: {
      background: row?.original?.gradient || '',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'local',
    },
  },
]

export default function TokenList({
  tokenPairs,
  onTradeClick,
}: TokenListProps): JSX.Element {
  const isSmallerThan = useIsSmallerThan()

  const columns = useMemo(() => getColumns(onTradeClick), [onTradeClick])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setHiddenColumns,
  } = useTable({
    columns,
    data: tokenPairs,
  })

  useEffect(() => {
    const hiddenColumns = getHiddenColumns(columns, isSmallerThan)
    setHiddenColumns(hiddenColumns)
  }, [columns, isSmallerThan, setHiddenColumns])

  return (
    <>
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
              <tr {...row.getRowProps(rowProps)} key={`tr-${row.id}`}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={`td-${cell.column.id}`}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
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
    </>
  )
}

function getHiddenColumns(
  columns: ColumnWithHide<TokenInfo>[],
  isSmallerThan: breakPointOptions
): string[] {
  return columns
    .filter(
      (column) =>
        column.hideBelow &&
        isSmallerThan[column.hideBelow as keyof breakPointOptions]
    )
    .map((column) => column?.id ?? '')
}

function getColumns(
  onTradeClick: HandleTradeClick
): ColumnWithHide<TokenInfo>[] {
  return [
    {
      id: 'imageUrl',
      Header: '',
      accessor: 'imageUrl',
      Cell: ({ row }: Cell<TokenInfo>) => {
        return (
          <Image
            src={row.original.imageUrl}
            height='30px'
            width='30px'
            layout={'fixed'}
          />
        )
      },
    },
    {
      id: 'name',
      Header: 'Name',
      accessor: 'name',
      hideBelow: 'md',
    },
    {
      id: 'ticker',
      Header: 'Ticker',
      accessor: 'ticker',
    },
    {
      id: 'price',
      Header: 'Price',
      accessor: 'price',
    },
    {
      id: 'liquidity',
      Header: 'Liquidity',
      accessor: 'liquidity',
      Cell: ({ row }: Cell<TokenInfo>) => {
        return '$' + row.original.liquidity
      },
      hideBelow: 'md',
    },
    {
      id: 'priceChange',
      Header: 'Change',
      accessor: 'priceChange',
    },
    {
      id: 'buy',
      Header: '',
      accessor: 'buy',
      Cell: ({ row }: Cell<TokenInfo>) => (
        <Button
          color={ButtonColor.DARK}
          onClick={() =>
            onTradeClick({
              token0: row.original.token0,
              token1: row.original.token1,
            })
          }
        >
          Buy
        </Button>
      ),
    },
  ]
}
