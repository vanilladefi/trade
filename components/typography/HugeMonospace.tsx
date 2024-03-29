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
        margin: var(--hugemonomargin);
      }
    `}</style>
  </>
)

export default HugeMonospace
