import { GraphQLClient } from 'graphql-request'

export * from './queries'

export const uniswapClient = new GraphQLClient(
  'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
)
