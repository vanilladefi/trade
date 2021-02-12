import { gql } from 'graphql-request'

const MetaFragment = gql`
  fragment Meta on _Meta_ {
    block {
      hash
      number
    }
    deployment
  }
`

export const MetaQuery = gql`
  query {
    _meta {
      ...Meta
    }
  }
  ${MetaFragment}
`

export const MetaSubscription = gql`
  subscription {
    _meta {
      ...Meta
    }
  }
  ${MetaFragment}
`
