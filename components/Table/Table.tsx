import type { BreakPoints } from 'components/GlobalStyles/Breakpoints'
import { useBreakpoints } from 'hooks/breakpoints'
import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useRef } from 'react'
import type {
  Cell,
  ColumnInstance,
  HeaderGroup,
  Meta,
  Row,
  TableKeyedProps,
} from 'react-table'
import {
  useFlexLayout,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'
import type {
  ColorBasedOnValue,
  LeftOrRightAlignable,
  ListColumn,
} from 'types/trade'
import PageControl from './PageControl'

interface Props<D extends Record<string, unknown>> {
  data: D[]
  columns: ListColumn<D>[]
  initialSortBy: Array<{ id: string; desc: boolean }>
  query?: string
  clearQuery?: () => void
  pagination?: boolean
  colorize?: boolean
}

type CustomColumnInstance<
  D extends Record<string, unknown>
> = ColumnInstance<D> & LeftOrRightAlignable & ColorBasedOnValue

const pageSizes = [20, 50, 100]

export default function Table<D extends Record<string, unknown>>({
  data,
  columns,
  initialSortBy,
  query,
  clearQuery,
  pagination = false,
  colorize = false,
}: Props<D>): JSX.Element {
  const { isSmaller, isBigger } = useBreakpoints()

  const autoResetPageRef = useRef(false)

  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 1, // minWidth is only used as a limit for resizing
      width: 2, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
    }),
    [],
  )

  const tableInstance = useTable(
    {
      data,
      columns,
      defaultColumn,
      initialState: {
        globalFilter: query,
        pageSize: pageSizes[0],
        sortBy: initialSortBy,
      },
      disableSortRemove: true,
      autoResetPage: autoResetPageRef.current,
      autoResetSortBy: false,
    },
    useGlobalFilter,
    useFlexLayout,
    useSortBy,
    usePagination,
  )

  const {
    rows: allRows,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    page: pageRows,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state,
  } = tableInstance

  useEffect(() => {
    // Disable auto reset page
    autoResetPageRef.current = false
  })

  useEffect(() => {
    const hiddenColumns = getHiddenColumns(columns, { isSmaller, isBigger })
    setHiddenColumns(hiddenColumns)
  }, [setHiddenColumns, columns, isSmaller, isBigger])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleQueryChanged = useCallback(
    debounce((val) => {
      // Enable auto reset page when search query changes
      // so the user is forced back to page 1
      autoResetPageRef.current = true
      setGlobalFilter(val)
    }, 200),
    [setGlobalFilter],
  )

  useEffect(() => {
    handleQueryChanged(query)
  }, [handleQueryChanged, query])

  const rows = pagination ? pageRows : allRows

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
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className='tbody' {...getTableBodyProps()}>
          {rows?.length ? (
            rows.map((row) => {
              prepareRow(row)
              return (
                <div
                  className='tr'
                  {...row.getRowProps((...p) => rowProps(...p, { colorize }))}
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
            })
          ) : (
            <div className='tr list-empty'>
              <div className='td'>
                {query ? (
                  <>
                    No results matching &quot;{query}&quot;.{' '}
                    {clearQuery && <a onClick={clearQuery}>Clear search</a>}
                  </>
                ) : (
                  <>No tokens</>
                )}
              </div>
            </div>
          )}
        </div>
        {pagination && allRows.length > pageSizes[0] && (
          <PageControl
            {...{
              gotoPage,
              canPreviousPage,
              previousPage,
              nextPage,
              canNextPage,
              pageCount,
              pageIndex: state.pageIndex,
              pageSize: state.pageSize,
              pageSizes,
              setPageSize,
            }}
          />
        )}
      </div>
      <style jsx>{`
        .table {
          width: 100%;
          font-family: var(--bodyfont);
          font-size: var(--bodysize);
          --buttonmargin: 0;
          margin-bottom: 2rem;
          --negativeValue: red;
          --positiveValue: green;
        }
        .td,
        .th {
          padding: var(--tablepadding);
        }
        .th {
          font-weight: var(--theadweight);
          font-size: var(--smallsize);
          text-transform: uppercase;
          color: var(--dark);
        }
        .tr {
          margin-bottom: 0.8rem;
          border-radius: 9999px;
          min-height: 60px;
        }
        .tbody .tr {
          background: var(--beige);
        }
        .tr.list-empty {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          color: var(--dark);
          opacity: 0.8;
        }
        .tr.list-empty a {
          display: inline-block;
          cursor: pointer;
          border-bottom: 1px solid var(--dark);
        }
      `}</style>
    </>
  )
}

const getStyles = <D extends Record<string, unknown>>(
  column: CustomColumnInstance<D>,
) => {
  return {
    style: {
      justifyContent: column?.align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'center',
      display: 'flex',
    },
  }
}

const getHeaderStyles = <D extends Record<string, unknown>>(
  column: CustomColumnInstance<D>,
) => {
  return {
    style: {
      textAlign: column?.align === 'right' ? 'right' : 'inherit',
    },
  }
}

const getColor = (value: string | number) => {
  const val = value ? parseFloat(value.toString()) : 0
  return val < 0
    ? 'var(--negativeValue)'
    : val > 0
    ? 'var(--positiveValue)'
    : 'inherit'
}

const getCellStyles = <D extends Record<string, unknown>>(
  column: CustomColumnInstance<D>,
  value?: number | string,
) => {
  const color = value && column?.colorBasedOnValue ? getColor(value) : 'inherit'

  return {
    style: {
      color,
    },
  }
}

const headerProps = <D extends Record<string, unknown>>(
  props: Partial<TableKeyedProps>,
  { column }: Meta<D, { column: HeaderGroup<D> }>,
) => [
  props,
  column.getSortByToggleProps(),
  getStyles(column),
  getHeaderStyles(column),
]

const cellProps = <D extends Record<string, unknown>>(
  props: Partial<TableKeyedProps>,
  { cell }: Meta<D, { cell: Cell<D> }>,
) => [props, getStyles(cell.column), getCellStyles(cell.column, cell.value)]

const rowProps = <D extends Record<string, unknown>>(
  props: Partial<TableKeyedProps>,
  { row }: Meta<D, { row: Row<D> }>,
  { colorize } = { colorize: false },
) => {
  const defaultColor = colorize ? 'var(--yellow)' : 'var(--beige)'

  const background =
    colorize && row.original?.logoColor
      ? `linear-gradient(to right, ${row.original.logoColor} -20%, ${defaultColor} 20%)`
      : defaultColor

  return [
    props,
    {
      style: {
        background,
      },
    },
  ]
}

function getHiddenColumns<D extends Record<string, unknown>>(
  columns: ListColumn<D>[],
  { isSmaller, isBigger }: BreakPoints,
): string[] {
  return columns
    .filter(
      ({ hideBelow, hideAbove }) =>
        (hideBelow && isSmaller[hideBelow]) ||
        (hideAbove && isBigger[hideAbove]),
    )
    .map(({ id }) => id ?? '')
}
