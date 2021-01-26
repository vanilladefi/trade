import Image from 'next/image'
import React, { useMemo } from 'react'
import { Cell } from 'react-table'
import Button, { ButtonColor } from './input/Button'
import TokenList, { ColumnWithHide, TokenInfo } from './TokenList'
import { HandleTradeClick } from 'types/Trade'

type Props = {
  tokenPairs: TokenInfo[]
  onTradeClick: HandleTradeClick
}

export default function AvailableTokens({
  tokenPairs,
  onTradeClick,
}: Props): JSX.Element {
  const columns = useMemo(() => getColumns(onTradeClick), [onTradeClick])

  return (
    <>
      <h2>AVAILABLE TOKENS</h2>
      {/* <span onClick={() => onTradeModalOpen(true)}>Open latest trade</span> */}
      <TokenList data={tokenPairs} columns={columns} />
    </>
  )
}

function getColumns(
  onTradeClick: HandleTradeClick
): ColumnWithHide<TokenInfo>[] {
  return [
    {
      id: 'imageUrl',
      Header: '',
      accessor: 'imageUrl',
      Cell: ({ row }: Cell<TokenInfo>) => {
        return (
          <Image
            src={row.original.imageUrl}
            height='30px'
            width='30px'
            layout={'fixed'}
          />
        )
      },
    },
    {
      id: 'name',
      Header: 'Name',
      accessor: 'name',
      hideBelow: 'md',
    },
    {
      id: 'ticker',
      Header: 'Ticker',
      accessor: 'ticker',
    },
    {
      id: 'price',
      Header: 'Price',
      accessor: 'price',
    },
    {
      id: 'liquidity',
      Header: 'Liquidity',
      accessor: 'liquidity',
      Cell: ({ row }: Cell<TokenInfo>) => {
        return '$' + row.original.liquidity
      },
      hideBelow: 'md',
    },
    {
      id: 'priceChange',
      Header: 'Change',
      accessor: 'priceChange',
    },
    {
      id: 'buy',
      Header: '',
      accessor: 'buy',
      Cell: ({ row }: Cell<TokenInfo>) => (
        <Button
          color={ButtonColor.DARK}
          onClick={() =>
            onTradeClick({
              token0: row.original.token0,
              token1: row.original.token1,
            })
          }
        >
          Buy
        </Button>
      ),
    },
  ]
}
