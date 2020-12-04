import React from 'react'

const MediaQueries = (): JSX.Element => (
  <style global>{`
    @media (max-width: var(--tablet)) {
      :root {
        --outermargin: 12px;
        --layoutmargin: 10px;
      }
    }
  `}</style>
)

export default MediaQueries
