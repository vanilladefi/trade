import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

export const HugeTitle = ({ children }: Props): JSX.Element => (
  <>
    <h1>{children}</h1>
    <style jsx>{`
      h1 {
        font-size: var(--hugetitlesize);
        font-weight: var(--titleweight);
        line-height: 1em;
        padding: 0;
        margin: var(--lander-titlemargin);
      }
    `}</style>
  </>
)

export const Title = ({ children }: Props): JSX.Element => (
  <>
    <h1>{children}</h1>
    <style jsx>{`
      h1 {
        font-size: var(--titlesize);
        font-weight: var(--titleweight);
        line-height: 1em;
        padding: 0;
        margin: var(--subpage-titlemargin);
      }
    `}</style>
  </>
)
