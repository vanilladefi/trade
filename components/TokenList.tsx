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
  return tokens.map
}

export default TokenList
