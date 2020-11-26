import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

const HugeMonospace = ({ children }: Props): JSX.Element => (
  <>
    <h2>{children}</h2>
    <style jsx>{`
      h2 {
        font-family: var(--monofont);
        font-weight: var(--monoweight);
        font-size: var(--hugemonosize);
        line-height: var(--hugemonolineheight);
        padding: 0;
        margin: 0 0 40px 0;
      }
    `}</style>
  </>
)

export default HugeMonospace
