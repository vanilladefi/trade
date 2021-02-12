import { GraphQLClient } from 'graphql-request'
import { SubscriptionClient } from 'graphql-subscriptions-client'

const THEGRAPH_ENDPOINT = 'api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'

export * from './queries/meta'
export * from './queries/tokens'

export const thegraphClient = new GraphQLClient(`https://${THEGRAPH_ENDPOINT}`)

export const thegraphClientSub = new SubscriptionClient(
  `wss://${THEGRAPH_ENDPOINT}`,
  {
    reconnect: true,
    lazy: true, // only connect when there is a query
    connectionCallback: (error) => {
      error && console.error(error)
    },
  },
)
