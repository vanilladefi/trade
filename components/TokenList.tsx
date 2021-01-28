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
import { HandleTradeClick, Token } from 'types/Trade'
import Button, { ButtonColor } from './input/Button'

type ExtraColumnFields = {
  hideBelow?: string
  align?: string
}

type TokenColumn = Column<Token & { buy?: string }> & ExtraColumnFields

type TokenListProps = {
  tokens: Token[]
  onTradeClick: HandleTradeClick
}

const headerProps: HeaderPropGetter<Token> = (props, { column }) =>
  getStyles(props, column)

const cellProps: CellPropGetter<Token> = (props, { cell }) =>
  getStyles(props, cell.column)

const getStyles = (
  props: Partial<TableKeyedProps>,
  column: ColumnInstance<Token> & ExtraColumnFields
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

const rowProps: RowPropGetter<Token> = (props, { row }) => [
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
  tokens,
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
      data: tokens,
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
  columns: TokenColumn[],
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

function getColumns(onTradeClick: HandleTradeClick): TokenColumn[] {
  return [
    {
      id: 'imageUrl',
      Header: '',
      accessor: 'logoURI',
      width: 1,
      Cell: ({ row }: Cell<Token>) => {
        return (
          row.original.logoURI && (
            <Image
              src={row.original.logoURI}
              height='30px'
              width='30px'
              layout='intrinsic'
            />
          )
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
      accessor: 'symbol',
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
      Cell: ({ row }: Cell<Token>) =>
        '$' + (row.original?.liquidity ?? 0).toFixed(3),
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
      Cell: ({ row }: Cell<Token>) => (
        <Button
          color={ButtonColor.DARK}
          onClick={() =>
            onTradeClick({
              token0: 'WETH',
              token1: row.original.symbol,
            })
          }
        >
          Buy
        </Button>
      ),
    },
  ]
}
