import type { CellProps } from 'react-table'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import type {
  HandleBuyClick,
  HandleSellClick,
  Token,
  ListColumn,
} from 'types/trade'
import { userTokensState } from 'state/tokens'
import useTokenSearch from 'hooks/useTokenSearch'
import { Table, Columns } from 'components/Table'
import Button, {
  ButtonColor,
  ButtonGroup,
  ButtonSize,
  Rounding,
} from 'components/input/Button'

interface Props {
  onBuyClick: HandleBuyClick
  onSellClick: HandleSellClick
}

export default function MyPositions({
  onBuyClick,
  onSellClick,
}: Props): JSX.Element {
  const userTokens = useRecoilValue(userTokensState)

  const [query, clearQuery] = useTokenSearch()

  const columns = useMemo(() => getColumns({ onBuyClick, onSellClick }), [
    onBuyClick,
    onSellClick,
  ])

  const initialSortBy = useMemo(() => [{ id: 'logoName', desc: false }], [])

  return (
    <Table
      data={userTokens}
      columns={columns}
      initialSortBy={initialSortBy}
      query={query}
      clearQuery={clearQuery}
      colorize
      pagination
    />
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
                token: {
                  address: row.original.address,
                  symbol: row.original.symbol,
                },
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
                token: {
                  address: row.original.address,
                  symbol: row.original.symbol,
                },
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
