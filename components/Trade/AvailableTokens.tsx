import type { CellProps } from 'react-table'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import type { HandleBuyClick, Token, ListColumn } from 'types/trade'
import { allTokensStoreState } from 'state/tokens'
import useTokenSearch from 'hooks/useTokenSearch'
import { Table, Columns } from 'components/Table'
import Button, { ButtonColor, ButtonSize } from 'components/input/Button'

interface Props {
  onBuyClick: HandleBuyClick
}

export default function AvailableTokens({ onBuyClick }: Props): JSX.Element {
  const tokens = useRecoilValue(allTokensStoreState)

  const [query, clearQuery] = useTokenSearch()

  const columns = useMemo(() => getColumns(onBuyClick), [onBuyClick])

  const initialSortBy = useMemo(() => [{ id: 'liquidity', desc: true }], [])

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
          size={ButtonSize.SMALL}
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
