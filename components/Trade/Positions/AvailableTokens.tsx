import { ButtonColor, ButtonSize } from 'components/input/Button'
import { Dots } from 'components/Spinner'
import { Columns } from 'components/Table'
import { TokenLogo } from 'components/Table/Cells'
import Wrapper from 'components/Wrapper'
import useTokenSearch from 'hooks/useTokenSearch'
import dynamic from 'next/dynamic'
import React, { useCallback, useMemo, useState } from 'react'
import type { CellProps } from 'react-table'
import { useRecoilValue } from 'recoil'
import { uniswapV2TokenState, uniswapV3TokenState } from 'state/tokens'
import { PrerenderProps } from 'types/content'
import { UniswapVersion } from 'types/general'
import { HandleBuyClick, Liquidity, ListColumn, Token } from 'types/trade'
import { hiddenTokens } from 'utils/config/vanilla'
import {
  CardinalityContent,
  LowLiquidityContent,
  VeryLowLiquidityContent,
} from './Content'

const Modal = dynamic(import('components/Modal'))
const ContentWrapper = dynamic(
  import('components/Modal').then((mod) => mod.ContentWrapper),
)
const Button = dynamic(import('components/input/Button'))
const Table = dynamic(import('components/Table').then((mod) => mod.Table))

type Props = PrerenderProps & {
  onBuyClick: HandleBuyClick
  uniswapVersion: UniswapVersion
}

type WrapperProps = {
  children: React.ReactNode
}

const LoaderWrapper: React.FC = ({ children }: WrapperProps) => {
  return (
    <>
      <Wrapper>
        <div>{children}</div>
      </Wrapper>
      <style jsx>{`
        div {
          position: relative;
          display: flex;
          width: 100vw;
          padding: var(--tablepadding);
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </>
  )
}

export default function AvailableTokens({
  onBuyClick,
  initialTokens,
  uniswapVersion,
}: Props): JSX.Element {
  const tokens = useRecoilValue(
    uniswapVersion === UniswapVersion.v2
      ? uniswapV2TokenState
      : uniswapV3TokenState,
  )

  const [alertModalContent, setAlertModalContent] = useState<
    JSX.Element | false
  >(false)

  const [query, clearQuery] = useTokenSearch()

  const columns = useMemo(() => {
    const setLiquidityModalOpen = (liquidity: Liquidity): void => {
      let content: JSX.Element | false = false
      if (uniswapVersion === UniswapVersion.v2) {
        if (liquidity === Liquidity.MEDIUM) {
          content = (
            <ContentWrapper>
              <LowLiquidityContent />
            </ContentWrapper>
          )
        } else if (liquidity === Liquidity.LOW) {
          content = (
            <ContentWrapper>
              <VeryLowLiquidityContent />
            </ContentWrapper>
          )
        }
      }
      setAlertModalContent(content)
    }
    const setCardinalityModalOpen = (): void => {
      const content: JSX.Element = (
        <ContentWrapper>
          <CardinalityContent />
        </ContentWrapper>
      )
      setAlertModalContent(content)
    }

    return getColumns(
      onBuyClick,
      setLiquidityModalOpen,
      setCardinalityModalOpen,
    )
  }, [onBuyClick, uniswapVersion])

  const initialSortBy = useMemo(() => [{ id: 'liquidity', desc: true }], [])

  const filterMinableTokens = useCallback(() => {
    const usedInitialTokens =
      uniswapVersion === UniswapVersion.v2
        ? initialTokens?.userPositionsV2
        : initialTokens?.userPositionsV3 || []
    const input = tokens?.length > 0 ? tokens : usedInitialTokens
    return input.filter(
      (token) => token.eligible && !hiddenTokens.includes(token.address),
    )
  }, [
    initialTokens?.userPositionsV2,
    initialTokens?.userPositionsV3,
    tokens,
    uniswapVersion,
  ])

  return (
    <>
      <Modal
        open={!!alertModalContent}
        onRequestClose={() => setAlertModalContent(false)}
      >
        {alertModalContent}
      </Modal>
      {filterMinableTokens().length > 0 ? (
        <Table
          data={filterMinableTokens()}
          columns={columns}
          initialSortBy={initialSortBy}
          query={query}
          clearQuery={clearQuery}
          pagination
        />
      ) : (
        <LoaderWrapper>
          <Dots />
        </LoaderWrapper>
      )}
    </>
  )
}

function getColumns(
  onBuyClick: HandleBuyClick,
  openLiquidityModal: (liquidity: Liquidity) => void,
  openCardinalityModal?: () => void,
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
          openCardinalityModal={openCardinalityModal}
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
          openCardinalityModal={openCardinalityModal}
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
