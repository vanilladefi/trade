import * as Vibrant from 'node-vibrant'
import { Palette } from 'node-vibrant/lib/color'
import React from 'react'
import { Column, Row, useTable } from 'react-table'
import useWindowWidthBreakpoints from 'use-window-width-breakpoints'
import { BreakPoint } from './GlobalStyles/Breakpoints'

type TokenInfo = {
  imageUrl: string
  name: string
  ticker: string
  price: string
  marketCap: string
  liquidity: string
  priceChange: number
}

type Props = {
  data: TokenInfo[]
  columns: Column<TokenInfo>[]
}

const beigeBackground = '#f3f1ea'
const yellowBackground = '#FBF3DB'

const calculateBackgroundColor = (imageUrl?: string | undefined): string => {
  const bgCallback = (_: undefined | Error, result: Palette | undefined) => {
    return result && result.Vibrant ? result.Vibrant.getHex() : yellowBackground
  }
  if (imageUrl && imageUrl !== '') {
    Vibrant.from(imageUrl).getPalette(bgCallback)
  }
}

const TokenList = ({ data, columns }: Props): JSX.Element => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  const breakpoint = useWindowWidthBreakpoints({
    xs: BreakPoint.XS,
    sm: BreakPoint.SM,
    md: BreakPoint.MD,
    lg: BreakPoint.LG,
    xl: BreakPoint.XL,
  })

  const getRowProps = (row: Row<TokenInfo>) => {
    const highlightColor = calculateBackgroundColor(row.original.imageUrl)
    const gradient = `linear-gradient(271.82deg, ${highlightColor} 78.9%, ${yellowBackground} 96.91%)`
    console.log(gradient)
    return {
      style: {
        background: gradient,
      },
    }
  }

  /* const showColumn = (column) =>  */
  console.log(breakpoint)

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
            <tr {...row.getRowProps(() => getRowProps(row))}>
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
          margin-left: -1rem;
          margin-right: -1rem;
          font-family: var(--bodyfont);
          font-size: var(--bodysize);
          border-spacing: 0 13px;
          margin-top: -13px;
        }
        td,
        th {
          text-align: left;
          padding: var(--tablepadding);
          border-spacing: 13px 0;
        }
        th {
          font-weight: var(--theadweight);
          font-size: var(--smallsize);
          text-transform: uppercase;
          color: rgba(#2c1929, 0.6);
          padding: 0px 17px;
        }
        tbody tr {
          background: var(--beige);
        }
        tr td:first-of-type {
          border-top-left-radius: 9999px;
          border-bottom-left-radius: 9999px;
          padding-right: 0;
        }
        tr td:last-of-type {
          border-top-right-radius: 9999px;
          border-bottom-right-radius: 9999px;
          padding-right: 0;
        }
      `}</style>
    </table>
  )
}

export default TokenList
