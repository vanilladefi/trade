import { GraphQLClient } from 'graphql-request'

export * from './queries/tokens'

export const thegraphClient = new GraphQLClient(
  'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
)
