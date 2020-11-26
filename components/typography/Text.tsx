import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

export const Highlight = ({ children }: Props): JSX.Element => (
  <>
    <p>{children}</p>
    <style jsx>{`
      p {
        font-size: var(--highlightsize);
        line-height: var(--highlightlineheight);
      }
    `}</style>
  </>
)
