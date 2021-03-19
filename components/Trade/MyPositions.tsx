import Button, {
  ButtonColor,
  ButtonGroup,
  ButtonSize,
  Rounding,
} from 'components/input/Button'
import { Spinner } from 'components/Spinner'
import { Columns, Table } from 'components/Table'
import useTokenSearch from 'hooks/useTokenSearch'
import useUserPositions from 'hooks/useUserPositions'
import React, { useMemo } from 'react'
import type { CellProps } from 'react-table'
import type {
  HandleBuyClick,
  HandleSellClick,
  ListColumn,
  Token,
} from 'types/trade'

interface Props {
  onBuyClick: HandleBuyClick
  onSellClick: HandleSellClick
  initialTokens?: Token[]
}

export default function MyPositions({
  onBuyClick,
  onSellClick,
}: Props): JSX.Element {
  const userPositions = useUserPositions()

  const [query, clearQuery] = useTokenSearch()

  const columns = useMemo(() => getColumns({ onBuyClick, onSellClick }), [
    onBuyClick,
    onSellClick,
  ])

  const initialSortBy = useMemo(() => [{ id: 'value', desc: true }], [])

  return userPositions ? (
    <Table
      data={userPositions}
      columns={columns}
      initialSortBy={initialSortBy}
      query={query}
      clearQuery={clearQuery}
      colorize
      pagination
    />
  ) : (
    <Spinner />
  )
}

function getColumns({
  onBuyClick,
  onSellClick,
}: {
  onBuyClick: HandleBuyClick
  onSellClick: HandleSellClick
}): ListColumn<Token>[] {
  return [
    Columns.LogoTicker,
    Columns.LogoName,
    Columns.Ticker,
    Columns.OwnedAmount,
    Columns.MarketValue,
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
            size={ButtonSize.SMALL}
            title='Sell'
            onClick={() =>
              onSellClick({
                pairId: row.original.pairId,
              })
            }
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
            size={ButtonSize.SMALL}
            title='Buy'
            onClick={() =>
              onBuyClick({
                pairId: row.original.pairId,
              })
            }
          >
            <span style={{ fontSize: '1.5rem' }}>&#43;</span>
          </Button>
        </ButtonGroup>
      ),
    },
  ]
}
