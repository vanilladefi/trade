import { BreakPoint } from 'components/GlobalStyles/Breakpoints'
import Button, {
  ButtonColor,
  ButtonSize,
  Rounding,
} from 'components/input/Button'
import Modal from 'components/Modal'
import { Spinner } from 'components/Spinner'
import { Columns, Table } from 'components/Table'
import { TokenLogo } from 'components/Table/Cells'
import { cellProps, rowProps } from 'components/Table/Table'
import { formatDistance } from 'date-fns'
import { parseUnits } from 'ethers/lib/utils'
import useTokenSearch from 'hooks/useTokenSearch'
import React, {
  MouseEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react'
import type { CellProps, Row } from 'react-table'
import { useRecoilValue } from 'recoil'
import { userV2TokensState } from 'state/tokens'
import { HandleSellClick, Liquidity, ListColumn, Token } from 'types/trade'
import { epoch } from 'utils/config'

interface Props {
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
  const getVpcOrEstimate: () => string = () => {
    const million = 1000000
    let vpcOrEstimate = 0
    if (row.original.vpc && row.original.vpc !== '0') {
      vpcOrEstimate = Number(row.original.vpc)
    } else if (row.original.reserveETH && row.original.reserveETH !== '0') {
      vpcOrEstimate = Number(
        parseUnits(row.original.reserveETH?.toString() || '0')
          .sub(parseUnits('500'))
          .mul(million)
          .div(parseUnits(row.original.reserveETH?.toString() || '1'))
          .toNumber() / million,
      )
    }
    return vpcOrEstimate.toLocaleString('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: 'never',
    })
  }

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
        <div
          className={`cell${
            row.original.reserveETH && Number(row.original.reserveETH) < 600
              ? ' liquidityWarning'
              : ''
          }`}
        >
          <span>
            <b>
              {row.original.vpc && row.original.vpc !== '0'
                ? 'VPC:'
                : 'Estimated max VPC:'}{' '}
              {blockNumber && blockNumber > 0 && getVpcOrEstimate()}
            </b>
          </span>
          <span>
            ETH reserves:{' '}
            {(Number(row.original.reserveETH) ?? 0).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
          </span>
          <span className='liquidityWarning'>
            {row.original.symbol === 'AMPL'
              ? 'Please contact <a link="mailto:hello@vanilladefi.com">hello@vanilladefi.com</a> for important information about your AMPL position'
              : row.original.reserveETH && Number(row.original.reserveETH) < 600
              ? 'ETH reserve of 500 and under result in a VPC of 0.'
              : ''}
          </span>
        </div>
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
        .cell.liquidityWarning {
          background: var(--alertbackground);
        }
        span.liquidityWarning {
          color: var(--alertcolor);
          font-weight: bold;
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

export default function MyPositions({ onSellClick }: Props): JSX.Element {
  const userPositions = useRecoilValue(userV2TokensState)
  const [query, clearQuery] = useTokenSearch()
  const [liquidityModalContent, setLiquidityModalContent] = useState<
    JSX.Element | false
  >(false)

  const getColumns = useCallback(
    ({
      onSellClick,
    }: {
      onSellClick: HandleSellClick
    }): ListColumn<Token>[] => {
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
                <strong style={{ color: 'red' }}> very low liquidity</strong>{' '}
                and will not result in any $VNL mined through profit mining, and
                selling might be difficult
              </p>
            </ContentWrapper>
          )
        }
        setLiquidityModalContent(content)
      }
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
              openLiquidityModal={(liquidity) =>
                setLiquidityModalOpen(liquidity)
              }
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
              openLiquidityModal={(liquidity) =>
                setLiquidityModalOpen(liquidity)
              }
              liquidityWarning
            />
          ),
        },
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
            <Button
              color={ButtonColor.DARK}
              rounded={Rounding.ALL}
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
          ),
        },
      ]
    },
    [],
  )

  const columns = useMemo(
    () => getColumns({ onSellClick }),
    [onSellClick, getColumns],
  )

  const initialSortBy = useMemo(() => [{ id: 'value', desc: true }], [])

  return userPositions ? (
    <>
      <Modal
        open={!!liquidityModalContent}
        onRequestClose={() => setLiquidityModalContent(false)}
      >
        {liquidityModalContent}
      </Modal>
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
    </>
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
