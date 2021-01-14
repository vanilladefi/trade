import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    fetchOptions: {
      mode: 'no-cors',
    },
  }),
  cache: new InMemoryCache(),
})
