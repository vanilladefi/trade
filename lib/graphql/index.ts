import { GraphQLClient } from 'graphql-request'
import { SubscriptionClient } from 'graphql-subscriptions-client'

export enum UniswapVersion {
  v2 = 'v2',
  v3 = 'v3',
}

const THEGRAPH_ENDPOINTS = {
  v2: {
    http: new GraphQLClient(
      'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    ),
    ws: new SubscriptionClient(
      'wss://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
      {
        reconnect: true,
        lazy: true, // only connect when there is a query
        connectionCallback: (error) => {
          error && console.error(error)
        },
      },
    ),
  },
  v3: {
    http: new GraphQLClient(
      'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-subgraph',
    ),
    ws: new SubscriptionClient(
      'wss://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-subgraph',
      {
        reconnect: true,
        lazy: true, // only connect when there is a query
        connectionCallback: (error) => {
          error && console.error(error)
        },
      },
    ),
  },
}

export * from './queries/meta'
export * from './queries/v2/tokens'

export const getTheGraphClient = (
  version: UniswapVersion,
): { http: GraphQLClient; ws: SubscriptionClient } => {
  return {
    http: THEGRAPH_ENDPOINTS[version].http,
    ws: THEGRAPH_ENDPOINTS[version].ws,
  }
}
