import Image from 'next/image'
import React, { useMemo, useEffect } from 'react'
import {
  Cell,
  CellPropGetter,
  Column,
  ColumnInstance,
  HeaderPropGetter,
  RowPropGetter,
  TableKeyedProps,
  useTable,
  useFlexLayout,
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
}

type ExtraColumnFields = {
  hideBelow?: string
  align?: string
}

type TokenInfoColumn = Column<TokenInfo & { buy?: string }> & ExtraColumnFields

type TokenListProps = {
  tokenPairs: TokenInfo[]
  onTradeClick: HandleTradeClick
}

const headerProps: HeaderPropGetter<TokenInfo> = (props, { column }) =>
  getStyles(props, column)

const cellProps: CellPropGetter<TokenInfo> = (props, { cell }) =>
  getStyles(props, cell.column)

const getStyles = (
  props: Partial<TableKeyedProps>,
  column: ColumnInstance<TokenInfo> & ExtraColumnFields
) => [
  props,
  {
    style: {
      justifyContent: column?.align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'center',
      display: 'flex',
    },
  },
]

const rowProps: RowPropGetter<TokenInfo> = (props, { row }) => [
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

  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 1, // minWidth is only used as a limit for resizing
      width: 2, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
    }),
    []
  )

  const columns = useMemo(() => getColumns(onTradeClick), [onTradeClick])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setHiddenColumns,
  } = useTable(
    {
      columns,
      data: tokenPairs,
      defaultColumn,
    },
    useFlexLayout
  )

  useEffect(() => {
    const hiddenColumns = getHiddenColumns(columns, isSmallerThan)
    setHiddenColumns(hiddenColumns)
  }, [columns, isSmallerThan, setHiddenColumns])

  return (
    <>
      <div {...getTableProps()} className='table'>
        <div>
          {headerGroups.map((headerGroup) => (
            <div
              className='tr'
              {...headerGroup.getHeaderGroupProps()}
              key={`headerGroup-${headerGroup.id}`}
            >
              {headerGroup.headers.map((column) => (
                <div
                  className='th'
                  {...column.getHeaderProps(headerProps)}
                  key={`th-${column.id}`}
                >
                  {column.render('Header')}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className='tbody' {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <div
                className='tr'
                {...row.getRowProps(rowProps)}
                key={`tr-${row.id}`}
              >
                {row.cells.map((cell) => (
                  <div
                    className='td'
                    {...cell.getCellProps(cellProps)}
                    key={`td-${cell.column.id}`}
                  >
                    {cell.render('Cell')}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
      <style jsx>{`
        .table {
          width: calc(100% + 2rem);
          margin-left: -1rem;
          margin-right: -1rem;
          font-family: var(--bodyfont);
          font-size: var(--bodysize);
          --buttonmargin: 0;
        }
        .td,
        .th {
          padding: var(--tablepadding);
        }
        .th {
          font-weight: var(--theadweight);
          font-size: var(--smallsize);
          text-transform: uppercase;
          color: rgba(#2c1929, 0.6);
        }
        .tr {
          margin-bottom: 1rem;
          border-radius: 60px;
        }
        .tbody .tr {
          background: var(--beige);
        }
      `}</style>
    </>
  )
}

function getHiddenColumns(
  columns: TokenInfoColumn[],
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

function getColumns(onTradeClick: HandleTradeClick): TokenInfoColumn[] {
  return [
    {
      id: 'imageUrl',
      Header: '',
      accessor: 'imageUrl',
      width: 1,
      Cell: ({ row }: Cell<TokenInfo>) => {
        return (
          <Image
            src={row.original.imageUrl}
            height='30px'
            width='30px'
            layout='intrinsic'
          />
        )
      },
    },
    {
      id: 'name',
      Header: 'Name',
      accessor: 'name',
      hideBelow: 'md',
      width: 3,
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
      hideBelow: 'md',
      Cell: ({ row }: Cell<TokenInfo>) => {
        return '$' + row.original.liquidity
      },
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
      align: 'right',
      width: 1,
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
