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
import React, { useMemo, useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { hodlModeState } from 'state/tokens'
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
  const hodlMode = useRecoilValue(hodlModeState)
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
      let columns = [Columns.LogoTicker, Columns.LogoName, Columns.Ticker]
      if (hodlMode) {
        columns = columns.concat([Columns.VPC, Columns.HTRS])
      } else {
        columns = columns.concat([Columns.MarketValue, Columns.OwnedAmount])
      }
      return columns.concat([
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
                size={ButtonSize.XSMALL}
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
      ])
    },
    [hodlMode],
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
