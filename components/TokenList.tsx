import Image from 'next/image'
import React, { useMemo, useEffect } from 'react'
import { useFlexLayout, usePagination, useSortBy, useTable } from 'react-table'
import type {
  CellProps,
  Column,
  ColumnInstance,
  Row,
  Meta,
  Cell,
  TableKeyedProps,
} from 'react-table'
import { useIsSmallerThan } from 'hooks/breakpoints'
import { breakPointOptions } from 'components/GlobalStyles/Breakpoints'
import Button, { ButtonColor } from 'components/input/Button'

interface TokenListProps {
  tokens: Token[]
  onTradeClick: HandleTradeClick
}

type LeftOrRightAlignable = { align?: 'left' | 'right' }
type ResponsivelyHidable = { hideBelow?: keyof breakPointOptions }

type CustomColumn<T extends Record<string, unknown>> = Column<T> &
  LeftOrRightAlignable &
  ResponsivelyHidable

const getStyles = (
  props: Partial<TableKeyedProps>,
  column: ColumnInstance<Token> & LeftOrRightAlignable
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

const cellProps = (
  props: Partial<TableKeyedProps>,
  { cell }: Meta<Token, { cell: Cell<Token> }>
) => getStyles(props, cell.column)

const rowProps = (
  props: Partial<TableKeyedProps>,
  { row }: Meta<Token, { row: Row<Token> }>
) => {
  const defaultColor = 'var(--yellow)'

  const background = row.original?.logoColor
    ? `linear-gradient(to right, ${row.original.logoColor} -20%, ${defaultColor} 20%)`
    : defaultColor

  return [
    props,
    {
      style: {
        background,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'local',
      },
    },
  ]
}

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

  const tableInstance = useTable(
    {
      data: tokens,
      columns,
      defaultColumn,
      initialState: { sortBy: [{ id: 'liquidity', desc: true }] },
      disableSortRemove: true,
    },
    useSortBy,
    useFlexLayout,
    usePagination
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance

  useEffect(() => {
    const hiddenColumns = getHiddenColumns(columns, isSmallerThan)
    setHiddenColumns(hiddenColumns)
  }, [columns, isSmallerThan, setHiddenColumns])

  const PageControl = () => (
    <div className='pagination'>
      <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
        {'<<'}
      </button>{' '}
      <button onClick={() => previousPage()} disabled={!canPreviousPage}>
        {'←'}
      </button>{' '}
      <button onClick={() => nextPage()} disabled={!canNextPage}>
        {'→'}
      </button>{' '}
      <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
        {'>>'}
      </button>{' '}
      <span>
        Page{' '}
        <strong>
          {pageIndex + 1} of {pageOptions.length}
        </strong>{' '}
      </span>
      <span>
        | Go to page:{' '}
        <input
          type='number'
          defaultValue={pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0
            gotoPage(page)
          }}
          style={{ width: '100px' }}
        />
      </span>{' '}
      <select
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value))
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <>
      <PageControl />
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
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={`th-${column.id}`}
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className='tbody' {...getTableBodyProps()}>
          {page.map((row) => {
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
      <PageControl />
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
          background: var(--yellow);
        }
      `}</style>
    </>
  )
}

function getHiddenColumns(
  columns: CustomColumn<Token>[],
  isSmallerThan: breakPointOptions
): string[] {
  return columns
    .filter(({ id, hideBelow }) => id && hideBelow && isSmallerThan[hideBelow])
    .map(({ id }) => id ?? '')
}

function getColumns(onTradeClick: HandleTradeClick): CustomColumn<Token>[] {
  return [
    {
      id: 'logo',
      Header: '',
      accessor: 'logoURI',
      width: 1,
      disableSortBy: true,
      Cell: ({ value }: CellProps<Token>) =>
        value ? (
          <Image src={value} height='30px' width='30px' layout='intrinsic' />
        ) : null,
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
      sortDescFirst: true,
      sortType: 'basic',
      Cell: ({ value }: CellProps<Token>) => (value ?? 0).toFixed(8) + ' ETH',
    },
    {
      id: 'liquidity',
      Header: 'Liquidity',
      accessor: 'liquidity',
      hideBelow: 'md',
      sortDescFirst: true,
      sortType: 'basic',
      Cell: ({ value }: CellProps<Token>) => '$' + (value ?? 0).toFixed(3),
    },
    {
      id: 'priceChange',
      Header: 'Change',
      accessor: 'priceChange',
      sortDescFirst: true,
      sortType: 'basic',
    },
    {
      id: 'trade',
      Header: '',
      align: 'right',
      width: 1,
      disableSortBy: true,
      Cell: ({ row }: { row: Row<Token> }) => (
        <Button
          color={ButtonColor.DARK}
          onClick={() =>
            onTradeClick({
              pairId: row.original.pairId,
              token: {
                address: row.original.address,
                symbol: row.original.symbol,
              },
            })
          }
        >
          Trade
        </Button>
      ),
    },
  ]
}
