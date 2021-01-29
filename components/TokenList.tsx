import Image from 'next/image'
import React, { useMemo, useEffect } from 'react'
import {
  CellPropGetter,
  Column,
  ColumnInstance,
  HeaderPropGetter,
  RowPropGetter,
  TableKeyedProps,
  useTable,
  useFlexLayout,
} from 'react-table'
import { useIsSmallerThan } from 'hooks/breakpoints'
import { breakPointOptions } from 'components/GlobalStyles/Breakpoints'
import { HandleTradeClick, Token } from 'types/Trade'
import Button, { ButtonColor } from 'components/input/Button'

type TokenListItem = Token & {
  priceStr: string
  liquidityStr: string
  buyElement: React.ReactNode
  logoElement: React.ReactNode
}

type ExtraColumnFields = {
  hideBelow?: string
  align?: string
}

type TokenColumn = Column<TokenListItem> & ExtraColumnFields

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
    rows,
    prepareRow,
    setHiddenColumns,
  } = useTable(
    {
      columns,
      data,
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

function getData(
  tokens: Token[],
  onTradeClick: HandleTradeClick
): TokenListItem[] {
  return tokens.map((t) => {
    return {
      ...t,
      buyElement: (
        <Button
          color={ButtonColor.DARK}
          onClick={() =>
            onTradeClick({
              token0: 'WETH',
              token1: t.symbol,
            })
          }
        >
          Buy
        </Button>
      ),
      logoElement: t.logoURI && (
        <Image src={t.logoURI} height='30px' width='30px' layout='intrinsic' />
      ),
      priceStr: '$' + (t.price ?? 0).toFixed(3),
      liquidityStr: '$' + (t.liquidity ?? 0).toFixed(3),
    }
  })
}

function getColumns(): TokenColumn[] {
  return [
    {
      id: 'logo',
      Header: '',
      accessor: 'logoElement',
      width: 1,
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
    },
    {
      id: 'liquidity',
      Header: 'Liquidity',
      accessor: 'liquidityStr',
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
      accessor: 'buyElement',
      align: 'right',
      width: 1,
    },
  ]
}
