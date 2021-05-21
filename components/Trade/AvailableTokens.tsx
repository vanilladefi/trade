import Button, { ButtonColor, ButtonSize } from 'components/input/Button'
import { Columns, Table } from 'components/Table'
import useTokenSearch from 'hooks/useTokenSearch'
import { UniswapVersion } from 'lib/graphql'
import { useMemo } from 'react'
import type { CellProps } from 'react-table'
import { useRecoilValue } from 'recoil'
import { uniswapV2TokenState, uniswapV3TokenState } from 'state/tokens'
import type { HandleBuyClick, ListColumn, Token } from 'types/trade'

interface Props {
  onBuyClick: HandleBuyClick
  initialTokens?: Token[]
  exchange: UniswapVersion
}

export default function AvailableTokens({
  onBuyClick,
  initialTokens = [],
  exchange,
}: Props): JSX.Element {
  const tokens = useRecoilValue(
    exchange === UniswapVersion.v2 ? uniswapV2TokenState : uniswapV3TokenState,
  )

  const [query, clearQuery] = useTokenSearch()

  const columns = useMemo(() => getColumns(onBuyClick), [onBuyClick])

  const initialSortBy = useMemo(() => [{ id: 'liquidity', desc: true }], [])

  const filterMinableTokens = (input: Token[]) =>
    input.filter((token) => token.eligible)

  return (
    <Table
      data={filterMinableTokens(tokens?.length ? tokens : initialTokens)}
      columns={columns}
      initialSortBy={initialSortBy}
      query={query}
      clearQuery={clearQuery}
      liquidityWarning
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
          size={ButtonSize.XSMALL}
          onClick={() =>
            onBuyClick({
              pairId: row.original.pairId,
            })
          }
        >
          BUY
        </Button>
      ),
    },
  ]
}
