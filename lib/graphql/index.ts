import { GraphQLClient } from 'graphql-request'
import { SubscriptionClient } from 'graphql-subscriptions-client'

export enum UniswapVersion {
  v2 = 'v2',
  v3 = 'v3',
}

const THEGRAPH_ENDPOINTS = {
  v2: 'api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  v3: 'api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-subgraph',
}

export * from './queries/meta'
export * from './queries/v2/tokens'

export const getTheGraphClient: (
  version: UniswapVersion,
) => { http: GraphQLClient; ws: SubscriptionClient } = (
  version: UniswapVersion,
) => {
  return {
    http: new GraphQLClient(`https://${THEGRAPH_ENDPOINTS[version]}`),
    ws: new SubscriptionClient(`wss://${THEGRAPH_ENDPOINTS[version]}`, {
      reconnect: true,
      lazy: true, // only connect when there is a query
      connectionCallback: (error) => {
        error && console.error(error)
      },
    }),
  }
}
