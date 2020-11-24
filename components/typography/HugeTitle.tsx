import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

const HugeTitle = ({ children }: Props) => (
  <>
    <h1>
      {children}
    </h1>
    <style jsx>{`
      h1 {
        font-size: var(--hugetitlesize);
        font-weight: var(--titleweight);
      }
    `}</style>
  </>
)

export default HugeTitle
