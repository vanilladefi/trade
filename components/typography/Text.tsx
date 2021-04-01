import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

export const Highlight = ({ children }: Props): JSX.Element => (
  <>
    <p>{children}</p>
    <style jsx>{`
      p {
        margin: 2rem 0 2rem;
        font-size: var(--highlightsize);
        line-height: var(--highlightlineheight);
      }
    `}</style>
  </>
)
