import { BreakPoint } from 'components/GlobalStyles/Breakpoints'
import Button, {
  ButtonColor,
  ButtonGroup,
  ButtonSize,
  Rounding,
} from 'components/input/Button'
import { Spinner } from 'components/Spinner'
import { Columns, Table } from 'components/Table'
import { cellProps, rowProps } from 'components/Table/Table'
import { formatDistance } from 'date-fns'
import useTokenSearch from 'hooks/useTokenSearch'
import useUserPositions from 'hooks/useUserPositions'
import React, { MouseEvent, useCallback, useMemo } from 'react'
import type { CellProps, Row } from 'react-table'
import type {
  HandleBuyClick,
  HandleSellClick,
  ListColumn,
  Token,
} from 'types/trade'
import { epoch } from 'utils/config'

interface Props {
  onBuyClick: HandleBuyClick
  onSellClick: HandleSellClick
  initialTokens?: Token[]
}

// No hooks can be used inside the RowRenderer because of Next.js error "less hooks rendered than previous render"
const RowRenderer = (
  row: Row<Token>,
  blockNumber?: number,
  expanded?: boolean,
  toggleExpanded?: () => void,
): JSX.Element => {
  const getSecondsToHtrs: () => number = () => {
    let estimatedDuration = 0
    if (row.original.htrs && blockNumber && blockNumber > 0) {
      const rootOfHtrs = Math.sqrt(parseFloat(row.original.htrs))
      if (rootOfHtrs > 0 && rootOfHtrs < 1) {
        const estimatedBlockNumber =
          (-rootOfHtrs * epoch + blockNumber) / (1 - rootOfHtrs)
        const estimatedBlockDelta = estimatedBlockNumber - blockNumber
        const blockTime = 13
        estimatedDuration = parseInt(
          (blockTime * estimatedBlockDelta).toString(),
        )
      }
    }
    return estimatedDuration
  }

  return (
    <div
      className={`expandableRow${expanded ? ' expanded' : ''}`}
      {...row.getRowProps((...p) => rowProps(...p, { colorize: true }))}
      key={`tr-${row.id}`}
      onClick={() =>
        window.getSelection()?.toString().length === 0 &&
        toggleExpanded &&
        toggleExpanded()
      }
    >
      <div className='tr' role='row'>
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
      <div className='hodlInfo' role='row'>
        <div className='cell'>
          <span>
            <b>
              HTRS:{' '}
              {blockNumber && blockNumber > 0 && getSecondsToHtrs() > 0
                ? Number(row.original.htrs ?? '0').toLocaleString('en-US', {
                    style: 'percent',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    signDisplay: 'never',
                  })
                : 'Calculating...'}
            </b>
          </span>
          {blockNumber && blockNumber > 0 && getSecondsToHtrs() > 0 && (
            <span>
              A new position would take{' '}
              {formatDistance(0, 1000 * getSecondsToHtrs(), {
                includeSeconds: true,
              })}{' '}
              to reach this ratio.
            </span>
          )}
        </div>
      </div>
      <style jsx>{`
        --tablepadding: 0.3rem 0.8rem;
        .td {
          padding: var(--tablepadding);
          font-variant-numeric: tabular-nums;
        }
        .expandableRow {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-bottom: 0.4rem;
          border-radius: 1.6rem;
          min-height: var(--tablerow-minheight);
          background: var(--beige);
          box-shadow: inset 0 0px 20px rgba(254, 222, 54, 0);
          transition: box-shadow 0.3s;
          cursor: pointer;
          box-shadow: 0 0 0 transparent;
          transition: 0.2s ease box-shadow;
          overflow: hidden;
        }
        .expandableRow:hover,
        .expandableRow.expanded {
          box-shadow: 0 0 0 2px var(--dark);
        }
        .tr {
          background: transparent;
          width: 100%;
          display: flex;
          flex-direction: row;
          padding: var(--tablepadding);
          padding-left: 0;
          padding-right: 0;
        }
        .expandableRow.expanded .tr {
          border-bottom: 1px var(--dark) solid;
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
        .expandableRow .hodlInfo {
          display: none;
        }
        .expandableRow.expanded .hodlInfo {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          flex-wrap: wrap;
        }
        .hodlInfo {
          position: relative;
          display: flex;
          flex-grow: 1;
          height: 100%;
        }
        .hodlInfo .cell {
          display: flex;
          position: relative;
          max-width: 100%;
          flex-direction: column;
          flex-basis: 0;
          flex-grow: 1;
          flex-shrink: 0;
          line-height: 1.5rem;
          padding: 1rem;
          height: 100%;
          min-height: 100%;
          border-right: 1px var(--dark) solid;
          min-width: min-content;
          cursor: auto;
        }
        .hodlInfo .cell:last-of-type {
          border-right: 0;
        }
        @media (max-width: ${BreakPoint.sm}px) {
          .hodlInfo .cell {
            min-width: 100%;
            flex-grow: 1;
            flex-basis: 1;
            border-right: 0;
            border-bottom: 1px var(--dark) solid;
          }
          .hodlInfo .cell:last-of-type {
            border-bottom: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default function MyPositions({
  onBuyClick,
  onSellClick,
}: Props): JSX.Element {
  const userPositions = useUserPositions()
  const [query, clearQuery] = useTokenSearch()

  const getColumns = useCallback(
    ({
      onBuyClick,
      onSellClick,
    }: {
      onBuyClick: HandleBuyClick
      onSellClick: HandleSellClick
    }): ListColumn<Token>[] => {
      return [
        Columns.LogoTicker,
        Columns.LogoName,
        Columns.Ticker,
        Columns.MarketValue,
        Columns.OwnedAmount,
        Columns.Profit,
        Columns.UnrealizedVNL,
        {
          id: 'trade',
          width: 1,
          disableSortBy: true,
          disableGlobalFilter: true,
          align: 'right',
          Cell: ({ row }: CellProps<Token>) => (
            <ButtonGroup>
              <Button
                color={ButtonColor.DARK}
                rounded={Rounding.LEFT}
                size={ButtonSize.XSMALL}
                title='Sell'
                onClick={(event: MouseEvent) => {
                  event.stopPropagation()
                  onSellClick({
                    pairId: row.original.pairId,
                  })
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>&minus;</span>
              </Button>
              <span
                style={{
                  borderRight: '1px solid #fff',
                }}
              />
              <Button
                color={ButtonColor.DARK}
                rounded={Rounding.RIGHT}
                size={ButtonSize.XSMALL}
                title='Buy'
                onClick={(event: MouseEvent) => {
                  event.stopPropagation()
                  onBuyClick({
                    pairId: row.original.pairId,
                  })
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>&#43;</span>
              </Button>
            </ButtonGroup>
          ),
        },
      ]
    },
    [],
  )

  const columns = useMemo(() => getColumns({ onBuyClick, onSellClick }), [
    onBuyClick,
    onSellClick,
    getColumns,
  ])

  const initialSortBy = useMemo(() => [{ id: 'value', desc: true }], [])

  return userPositions ? (
    <Table
      data={userPositions}
      columns={columns}
      initialSortBy={initialSortBy}
      query={query}
      clearQuery={clearQuery}
      rowRenderer={RowRenderer}
      colorize
      pagination
    />
  ) : (
    <div className='spinnerWrapper'>
      <Spinner />
      <style jsx>{`
        .spinnerWrapper {
          display: flex;
          width: 100%;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          height: 80px;
          --iconsize: 2rem;
        }
      `}</style>
    </div>
  )
}
