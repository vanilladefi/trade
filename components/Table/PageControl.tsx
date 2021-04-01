import { ChevronLeft, ChevronRight } from 'react-feather'
import { BreakPoint } from 'components/GlobalStyles/Breakpoints'

interface Props {
  gotoPage: (updater: number | ((pageIndex: number) => number)) => void
  canPreviousPage: boolean
  previousPage: () => void
  nextPage: () => void
  canNextPage: boolean
  pageCount: number
  pageIndex: number
  pageSize: number
  pageSizes: number[]
  setPageSize: (pageSize: number) => void
}

export default function PageControl({
  gotoPage,
  canPreviousPage,
  previousPage,
  nextPage,
  canNextPage,
  pageCount,
  pageIndex,
  pageSize,
  pageSizes,
  setPageSize,
}: Props): JSX.Element {
  return (
    <div className='container'>
      <div className='page-size flex-container'>
        <span>Show</span>
        <span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
            }}
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </span>
        <span>records</span>
      </div>
      {pageCount > 1 && (
        <div className='page-control flex-container'>
          <button
            className='select-ball'
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            aria-label='Previous page'
          >
            <ChevronLeft />
          </button>
          <span className='select-page pill flex-container'>
            {[...Array(pageCount).keys()].map((i) => (
              <a
                key={`select-page-${i}`}
                className={`select-page-item select-ball ${
                  pageIndex === i ? 'active' : ''
                }`}
                onClick={() => gotoPage(i)}
              >
                {i + 1}
              </a>
            ))}
          </span>
          <span className='current-page pill flex-container'>
            <span className='select-ball'>{pageIndex + 1}</span>
            <span>/</span>
            <span className='select-ball'>{pageCount}</span>
          </span>
          <button
            className='select-ball'
            onClick={() => nextPage()}
            disabled={!canNextPage}
            aria-label='Next page'
          >
            <ChevronRight />
          </button>
        </div>
      )}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .container {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-top: 1.5rem;
        }

        .pill {
          background: #f3f1ea;
          border-radius: 40px;
        }

        .flex-container {
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .page-size {
          font-size: 1.1rem;
        }

        .page-size > * {
          margin-right: 0.4rem;
        }

        .page-size > *:last-child {
          margin-right: 0;
        }

        .page-size select {
          padding: 0.4rem 0.3rem;
          border: 1px solid #dedede;
          border-radius: 9px;
          font-size: 1.1rem;
          outline: none;
        }

        .page-control {
          justify-content: flex-end;
          flex: 1;
          font-size: 1.1rem;
        }

        .page-control > * {
          margin-right: 0.5rem;
        }

        .page-control > *:last-child {
          margin-right: 0;
        }

        .page-control .current-page {
          display: none;
        }

        .select-ball {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 40px;
          border: none;
          width: 45px;
          height: 45px;
          outline: none;
        }

        a.select-ball,
        button.select-ball {
          cursor: pointer;
          color: var(--dark);
        }

        .select-ball.active {
          background: var(--dark);
          color: #fff;
        }

        .select-ball:disabled {
          opacity: 0.1;
        }

        @media (max-width: ${BreakPoint.sm}px) {
          .container {
            flex-direction: column;
          }
          .page-size {
            margin-bottom: 1rem;
          }
        }

        @media (max-width: 460px) {
          .page-control .select-page {
            display: none;
          }
          .page-control .current-page {
            display: flex;
          }
        }
      `}</style>
    </div>
  )
}
