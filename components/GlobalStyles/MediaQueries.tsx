import React from 'react'

const MediaQueries = (): JSX.Element => (
  <style global>{`
    @media (max-width: var(--tablet)) {
      :root {
        --outermargin: 12px;
        --layoutmargin: 10px;
      }
    }
    @media (min-width: var(--laptop)) {
      :root {
        --outermargin: 44px;
        --layoutmargin: 40px;
        --titlesize: 67px;
        --hugetitlesize: 76px;
      }
    }
    @media (min-width: var(--desktop)) {
      :root {
        --outermargin: 44px;
        --layoutmargin: 40px;
        --titlesize: 67px;
        --hugetitlesize: 76px;
      }
    }
  `}</style>
)

export default MediaQueries
