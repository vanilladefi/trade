import Button, { ButtonColor, ButtonSize } from 'components/input/Button'
import Modal from 'components/Modal'
import { Columns, Table } from 'components/Table'
import { TokenLogo } from 'components/Table/Cells'
import { cellProps } from 'components/Table/Table'
import useTokenSearch from 'hooks/useTokenSearch'
import { ReactNode, useMemo, useState } from 'react'
import type { CellProps } from 'react-table'
import { useRecoilValue } from 'recoil'
import { allTokensStoreState } from 'state/tokens'
import { HandleBuyClick, Liquidity, ListColumn, Token } from 'types/trade'

interface Props {
  onBuyClick: HandleBuyClick
  initialTokens?: Token[]
}

export default function AvailableTokens({
  onBuyClick,
  initialTokens = [],
}: Props): JSX.Element {
  const tokens = useRecoilValue(allTokensStoreState)

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
            padding: 1.8rem;
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
            This token has
            <strong style={{ color: 'orange' }}> low liquidity</strong> and
            pricing might be wrong. Buy with caution
          </ContentWrapper>
        )
      } else if (liquidity === Liquidity.LOW) {
        content = (
          <ContentWrapper>
            This token currently has{' '}
            <strong style={{ color: 'red' }}> very low liquidity</strong> and
            will not result in any $VNL or selling might not be possible
          </ContentWrapper>
        )
      }
      setLiquidityModalContent(content)
    }
    return getColumns(onBuyClick, setLiquidityModalOpen)
  }, [onBuyClick])

  const initialSortBy = useMemo(() => [{ id: 'liquidity', desc: true }], [])

  const filterMinableTokens = (input: Token[]) =>
    input.filter((token) => token.eligible)

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
