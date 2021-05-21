import Button, { ButtonColor, ButtonSize } from 'components/input/Button'
import Modal from 'components/Modal'
import { Columns, Table } from 'components/Table'
import { TokenLogo } from 'components/Table/Cells'
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

  const [liquidityModalContent, setLiquidityModalContent] = useState<
    JSX.Element | false
  >(false)

  const [query, clearQuery] = useTokenSearch()

  const columns = useMemo(() => {
    type ContentProps = {
      children?: ReactNode
    }
    const ContentWrapper = ({ children }: ContentProps) => (
      <div>
        {children}
        <style jsx>{`
          div {
            padding: 1rem 1.8rem;
            max-width: 500px;
            flex-shrink: 1;
            display: flex;
            flex-wrap: wrap;
            font-family: var(--bodyfont);
            font-size: var(--bodysize);
            font-weight: var(--bodyweight);
          }
        `}</style>
      </div>
    )
    const setLiquidityModalOpen = (liquidity: Liquidity): void => {
      let content: JSX.Element | false = false
      if (liquidity === Liquidity.MEDIUM) {
        content = (
          <ContentWrapper>
            <p>
              This token has
              <strong style={{ color: 'orange' }}> low liquidity</strong>, and
              pricing might be wrong. Buy with caution
            </p>
          </ContentWrapper>
        )
      } else if (liquidity === Liquidity.LOW) {
        content = (
          <ContentWrapper>
            <p>
              This token currently has{' '}
              <strong style={{ color: 'red' }}> very low liquidity</strong> and
              will not result in any $VNL mined through profit mining, and
              selling might be difficult
            </p>
          </ContentWrapper>
        )
      }
      setLiquidityModalContent(content)
    }
    return getColumns(onBuyClick, setLiquidityModalOpen)
  }, [onBuyClick])

  const initialSortBy = useMemo(() => [{ id: 'liquidity', desc: true }], [])

  const filterMinableTokens = (input: Token[]) =>
    input.filter(
      (token) => token.eligible && !hiddenTokens.includes(token.address),
    )

  return (
    <>
      <Modal
        open={!!liquidityModalContent}
        onRequestClose={() => setLiquidityModalContent(false)}
      >
        {liquidityModalContent}
      </Modal>
      <Table
        data={filterMinableTokens(tokens?.length ? tokens : initialTokens)}
        columns={columns}
        initialSortBy={initialSortBy}
        query={query}
        clearQuery={clearQuery}
        pagination
      />
    </>
  )
}

function getColumns(
  onBuyClick: HandleBuyClick,
  openLiquidityModal: (liquidity: Liquidity) => void,
): ListColumn<Token>[] {
  return [
    {
      id: 'logoTicker',
      Header: 'Token',
      accessor: 'symbol',
      sortType: 'basic',
      hideAbove: 'md',
      Cell: (props: CellProps<Token>) => (
        <TokenLogo
          {...props}
          openLiquidityModal={openLiquidityModal}
          liquidityWarning
        />
      ),
    },
    {
      id: 'logoName',
      Header: 'Token',
      accessor: 'name',
      hideBelow: 'md',
      width: 3,
      Cell: (props: CellProps<Token>) => (
        <TokenLogo
          {...props}
          openLiquidityModal={openLiquidityModal}
          liquidityWarning
        />
      ),
    },
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
