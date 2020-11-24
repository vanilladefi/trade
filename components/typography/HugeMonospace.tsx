import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

const HugeMonospace = ({ children }: Props) => (
  <>
    <h2>
      {children}
    </h2>
    <style jsx>{`
      h2 {
        font-family: var(--monofont);
        font-weight: var(--monoweight);
        font-size: var(--hugemonosize);
      }
    `}</style>
  </>
)

export default HugeMonospace
