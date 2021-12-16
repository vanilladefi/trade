import { GraphQLClient } from 'graphql-request'

export enum UniswapVersion {
  v2 = 'v2',
  v3 = 'v3',
}

const THEGRAPH_ENDPOINTS = {
  v2: {
    http: new GraphQLClient(
      'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    ),
  },
  v3: {
    http: new GraphQLClient(
      'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    ),
  },
}

export * from './queries/meta'
export * as v2 from './queries/v2/tokens'
export * as v3 from './queries/v3/tokens'

export const getTheGraphClient = (
  version: UniswapVersion,
): { http: GraphQLClient | null } => {
  return !!THEGRAPH_ENDPOINTS[version]
    ? {
        http: THEGRAPH_ENDPOINTS[version].http,
      }
    : {
        http: null,
      }
}
