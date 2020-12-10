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
  tokens?: Array<Token>
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
    </table>
  )
}

export default TokenList
