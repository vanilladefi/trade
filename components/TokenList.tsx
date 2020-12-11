import React from 'react'
import { useTable } from 'react-table'

type Token = {
  imageUrl: string
  name: string
  ticker: string
  price: string
  marketCap: string
  liquidity: string
  priceChange: number
}

type Props = {
  data: {
    imageUrl: string
    name: string
    ticker: string
    price: string
    marketCap: string
    liquidity: string
    priceChange: number
  }[]
  columns: {
    Header: string
    accessor: string
  }[]
}

const mockup: Array<Token> = [
  {
    imageUrl: '/images/uniswap.png',
    name: 'Uniswap',
    ticker: 'UNI',
    price: '$447.63',
    marketCap: '$1,000,000,000',
    liquidity: '$26,364,263',
    priceChange: -1.25,
  },
  {
    imageUrl: '/images/cvault.png',
    name: 'cVault.finance',
    ticker: 'CORE',
    price: '$447.63',
    marketCap: '$1,000,000,000',
    liquidity: '$26,364,263',
    priceChange: -1.25,
  },
]

const TokenList = ({ tokens = mockup }: Props): JSX.Element => {
  const data = React.useMemo(
    () => [
      {
        col1: 'Hello',
        col2: 'World',
      },

      {
        col1: 'react-table',
        col2: 'rocks',
      },

      {
        col1: 'whatever',
        col2: 'you want',
      },
    ],

    []
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Column 1',
        accessor: 'col1', // accessor is the "key" in the data
      },

      {
        Header: 'Column 2',
        accessor: 'col2',
      },
    ],

    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
      <style jsx>{`
        table {
          border-collapse: separate;
          table-layout: auto;
          width: calc(100% + 34px);
          margin-left: -17px;
          margin-right: -17px;
          font-family: var(--bodyfont);
          font-size: var(--bodysize);
          border-spacing: 0 13px;
          margin-top: -13px;
        }
        td,
        th {
          text-align: left;
          padding: 14px 17px;
          border-spacing: 13px 0;
        }
        th {
          font-weight: var(--theadweight);
          font-size: var(--smallsize);
          text-transform: uppercase;
          color: rgba(#2c1929, 0.6);
          padding: 0px 17px;
        }
        tr td:first-of-type {
          border-top-left-radius: 9999px;
          border-bottom-left-radius: 9999px;
        }
        tr td:last-of-type {
          border-top-right-radius: 9999px;
          border-bottom-right-radius: 9999px;
        }
        td {
          background: var(--beige);
        }
      `}</style>
    </table>
  )
}

export default TokenList
