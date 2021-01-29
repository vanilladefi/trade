/* tslint:disable */
// TODO: tslint

import Image from 'next/image'
import React, { useMemo, useEffect } from 'react'
import {
  CellPropGetter,
  Column,
  ColumnInstance,
  HeaderPropGetter,
  RowPropGetter,
  Row,
  TableKeyedProps,
  useTable,
  useFlexLayout,
  useSortBy,
  usePagination,
} from 'react-table'
import { useIsSmallerThan } from 'hooks/breakpoints'
import { breakPointOptions } from 'components/GlobalStyles/Breakpoints'
import { HandleTradeClick, Token, TokenNumberFields } from 'types/Trade'
import Button, { ButtonColor } from 'components/input/Button'

type TokenListItem = Token & {
  priceStr: string
  liquidityStr: string
  tradeElement: React.ReactNode
  logoElement: React.ReactNode
}

type ExtraColumnFields = {
  hideBelow?: string
  align?: string
}

type TokenColumn = Column & ExtraColumnFields

type TokenListProps = {
  tokens: Token[]
  onTradeClick: HandleTradeClick
}

const headerProps: HeaderPropGetter<TokenListItem> = (props, { column }) =>
  getStyles(props, column)

const cellProps: CellPropGetter<TokenListItem> = (props, { cell }) =>
  getStyles(props, cell.column)

const getStyles = (
  props: Partial<TableKeyedProps>,
  column: ColumnInstance<TokenListItem> & ExtraColumnFields
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

const rowProps: RowPropGetter<TokenListItem> = (props, { row }) => [
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

  const columns = useMemo(() => getColumns(), [])
  const data = useMemo(() => getData(tokens, onTradeClick), [
    tokens,
    onTradeClick,
  ])

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
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { sortBy: [{ id: 'liquidity', desc: true }] },
      disableSortRemove: true,
    },
    useFlexLayout,
    useSortBy,
    usePagination
  )

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
                  // {...column.getHeaderProps(headerProps)}
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
          {page.map((row: Row<TokenListItem>) => {
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

function getData(
  tokens: Token[],
  onTradeClick: HandleTradeClick
): TokenListItem[] {
  return tokens.map((t) => {
    return {
      ...t,
      tradeElement: (
        <Button
          color={ButtonColor.DARK}
          onClick={() =>
            onTradeClick({
              pairId: t.pairId,
              token: { address: t.address, symbol: t.symbol },
            })
          }
        >
          Trade
        </Button>
      ),
      logoElement: t.logoURI && (
        <Image src={t.logoURI} height='30px' width='30px' layout='intrinsic' />
      ),
      priceStr: (t.price ?? 0).toFixed(8) + ' ETH',
      liquidityStr: '$' + (t.liquidity ?? 0).toFixed(3),
    }
  })
}

/*
 * Used to get the original number value from row
 *
 * Some fields are converted to string representation (price => priceStr for example)
 * or a ReactNode in the data layer. This function helps to sort the rows
 * according to the original value.
 */
function sortByOriginalNumber(
  { original: originalA }: Row<TokenListItem>,
  { original: originalB }: Row<TokenListItem>,
  columnId: string
) {
  const valA = originalA[columnId as TokenNumberFields] || 0
  const valB = originalB[columnId as TokenNumberFields] || 0
  if (valA > valB) return 1
  if (valA < valB) return -1
}

function getColumns(): TokenColumn[] {
  return [
    {
      id: 'logo',
      Header: '',
      accessor: 'logoElement',
      width: 1,
      disableSortBy: true,
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
      accessor: 'priceStr',
      sortDescFirst: true,
      sortType: sortByOriginalNumber,
    },
    {
      id: 'liquidity',
      Header: 'Liquidity',
      accessor: 'liquidityStr',
      hideBelow: 'md',
      sortDescFirst: true,
      sortType: sortByOriginalNumber,
    },
    {
      id: 'priceChange',
      Header: 'Change',
      accessor: 'priceChange',
      sortDescFirst: true,
      sortType: sortByOriginalNumber,
    },
    {
      id: 'trade',
      Header: '',
      accessor: 'tradeElement',
      align: 'right',
      width: 1,
      disableSortBy: true,
    },
  ]
}
