import type { BreakPoints } from 'components/GlobalStyles/Breakpoints'
import { useBreakpoints } from 'hooks/breakpoints'
import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import type {
  Cell,
  ColumnInstance,
  HeaderGroup,
  Meta,
  Row,
  TableKeyedProps,
  TableSortByToggleProps,
} from 'react-table'
import {
  useExpanded,
  useFlexLayout,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'
import { useRecoilValue } from 'recoil'
import { currentBlockNumberState } from 'state/meta'
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
  liquidityWarning?: boolean
  rowRenderer?: (
    row: Row<D>,
    blockNumber?: number,
    expanded?: boolean,
    toggleExpanded?: () => void,
  ) => JSX.Element
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
  liquidityWarning = false,
  rowRenderer,
}: Props<D>): JSX.Element {
  const { isSmaller, isBigger } = useBreakpoints()
  const blockNumber = useRecoilValue(currentBlockNumberState)

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
    useExpanded,
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

  const rows = pagination ? pageRows : allRows

  const [expandedRows, setExpandedRows] = useState<Array<boolean>>(
    new Array<boolean>(rows.length),
  )

  const renderRow = useCallback(() => {
    const toggleExpandedRow = (rowIndex: number) => {
      const newExpandedRows = JSON.parse(JSON.stringify(expandedRows))
      newExpandedRows[rowIndex] = !expandedRows[rowIndex]
      setExpandedRows(newExpandedRows)
    }
    return rows.map((row, index) => {
      prepareRow(row)
      return (
        (rowRenderer &&
          rowRenderer(row, blockNumber, expandedRows[index], () =>
            toggleExpandedRow(index),
          )) || (
          <>
            <div
              className='tr'
              {...row.getRowProps((...p) =>
                rowProps(...p, { colorize, liquidityWarning }),
              )}
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
            <style jsx>{`
              .td,
              .th {
                padding: var(--tablepadding);
                font-variant-numeric: tabular-nums;
              }
              .tr {
                margin-bottom: 0.4rem;
                border-radius: 9999px;
                min-height: var(--tablerow-minheight);
              }
              .tbody .tr {
                background: var(--beige);
                box-shadow: inset 0 0px 20px rgba(254, 222, 54, 0);
                transition: box-shadow 0.3s;
              }
              .tbody .tr:hover {
                box-shadow: inset 0 -20px 20px rgba(254, 222, 54, 0.2);
              }
              .tr.list-empty {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                color: var(--dark);
                opacity: 0.9;
              }
              .tr.list-empty a {
                display: inline-block;
                cursor: pointer;
                border-bottom: 1px solid var(--dark);
              }
            `}</style>
          </>
        )
      )
    })
  }, [
    blockNumber,
    colorize,
    expandedRows,
    liquidityWarning,
    prepareRow,
    rowRenderer,
    rows,
  ])

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
            renderRow()
          ) : (
            <div className='tr list-empty'>
              <div className='td'>
                {query ? (
                  <>
                    No results matching &quot;{query}&quot;.{' '}
                    {clearQuery && (
                      <a className='clear-search' onClick={clearQuery}>
                        Clear search
                      </a>
                    )}
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
        }
        .td,
        .th {
          padding: var(--tablepadding);
          font-variant-numeric: tabular-nums;
        }
        .th {
          font-weight: var(--theadweight);
          font-size: var(--smallsize);
          text-transform: uppercase;
          color: var(--dark);
        }
        .tr {
          margin-bottom: 0.4rem;
          border-radius: 9999px;
          min-height: var(--tablerow-minheight);
        }

        .tbody .tr {
          background: var(--beige);
          box-shadow: inset 0 0px 20px rgba(254, 222, 54, 0);
          transition: box-shadow 0.3s;
        }
        .tbody .tr:hover {
          box-shadow: inset 0 -20px 20px rgba(254, 222, 54, 0.2);
        }
        .tr.list-empty {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          color: var(--dark);
          opacity: 0.9;
        }
        .tr.list-empty a {
          display: inline-block;
          cursor: pointer;
          border-bottom: 1px solid var(--dark);
        }
        .clear-search {
          color: var(--dark);
          margin-left: 0.5rem;
        }
      `}</style>
    </>
  )
}

export const getStyles = <D extends Record<string, unknown>>(
  column: CustomColumnInstance<D>,
): {
  style: {
    justifyContent: string
    alignItems: string
    display: string
  }
} => {
  return {
    style: {
      justifyContent: column?.align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'center',
      display: 'flex',
    },
  }
}

export const getHeaderStyles = <D extends Record<string, unknown>>(
  column: CustomColumnInstance<D>,
): {
  style: {
    textAlign: string
    alignItems: string
  }
} => {
  return {
    style: {
      textAlign: column?.align === 'right' ? 'right' : 'inherit',
      alignItems: 'flex-end',
    },
  }
}

export const getColor = (
  value: string | number,
): 'var(--negativeValue)' | 'var(--positiveValue)' | 'inherit' => {
  const val = value ? parseFloat(value.toString()) : 0
  return val < 0
    ? 'var(--negativeValue)'
    : val > 0
    ? 'var(--positiveValue)'
    : 'inherit'
}

export const getCellStyles = <D extends Record<string, unknown>>(
  column: CustomColumnInstance<D>,
  value?: number | string,
): {
  style: {
    color: string
  }
} => {
  const color = value && column?.colorBasedOnValue ? getColor(value) : 'inherit'

  return {
    style: {
      color,
    },
  }
}

export const headerProps = <D extends Record<string, unknown>>(
  props: Partial<TableKeyedProps>,
  { column }: Meta<D, { column: HeaderGroup<D> }>,
): TableSortByToggleProps[] => [
  props,
  column.getSortByToggleProps(),
  getStyles(column),
  getHeaderStyles(column),
]

export const cellProps = <D extends Record<string, unknown>>(
  props: Partial<TableKeyedProps>,
  { cell }: Meta<D, { cell: Cell<D> }>,
): (
  | Partial<TableKeyedProps>
  | {
      style: {
        justifyContent: string
        alignItems: string
        display: string
      }
    }
)[] => [props, getStyles(cell.column), getCellStyles(cell.column, cell.value)]

type RowOptions = { colorize?: boolean; liquidityWarning?: boolean }
export const rowProps = <D extends Record<string, unknown>>(
  props: Partial<TableKeyedProps>,
  { row }: Meta<D, { row: Row<D> }>,
  { colorize, liquidityWarning }: RowOptions = {
    colorize: false,
    liquidityWarning: false,
  },
): Partial<TableKeyedProps>[] => {
  const defaultColor = colorize ? 'var(--yellow)' : 'var(--beige)'

  const background =
    colorize && row.original?.logoColor
      ? `linear-gradient(to right, ${row.original.logoColor} -20%, ${defaultColor} 20%)`
      : liquidityWarning && Number(row.original?.reserve) < 600
      ? 'var(--alertbackground)'
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
