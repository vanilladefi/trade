import type { CellProps } from 'react-table'
import { useCallback, useMemo } from 'react'
import { useRecoilState } from 'recoil'
import type { HandleBuyClick, Token, ListColumn } from 'types/trade'
import { tokenSearchQuery } from 'state/tokenSearch'
import { Table, Columns } from 'components/Table'
import Button, { ButtonColor } from 'components/input/Button'

interface Props {
  tokens: Token[]
  onBuyClick: HandleBuyClick
}

export default function AvailableTokens({
  tokens,
  onBuyClick,
}: Props): JSX.Element {
  const columns = useMemo(() => getColumns(onBuyClick), [onBuyClick])
  const initialSortBy = useMemo(() => [{ id: 'liquidity', desc: true }], [])
  const [query, setQuery] = useRecoilState(tokenSearchQuery)

  const clearQuery = useCallback(() => {
    setQuery('')
  }, [setQuery])

  return (
    <Table
      data={tokens}
      columns={columns}
      initialSortBy={initialSortBy}
      query={query}
      clearQuery={clearQuery}
      pagination
    />
  )
}

function getColumns(onBuyClick: HandleBuyClick): ListColumn<Token>[] {
  return [
    Columns.LogoTicker,
    Columns.LogoName,
    Columns.Ticker,
    Columns.Price,
    Columns.Liquidity,
    Columns.PriceChange,
    {
      id: 'trade',
      width: 1,
      disableSortBy: true,
      disableGlobalFilter: true,
      align: 'right',
      Cell: ({ row }: CellProps<Token>) => (
        <Button
          color={ButtonColor.DARK}
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
          BUY
        </Button>
      ),
    },
  ]
}
