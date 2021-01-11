import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

export const Title = ({ children }: Props): JSX.Element => (
  <>
    <h1>{children}</h1>
    <style jsx>{`
      h1 {
        font-size: var(--titlesize);
        font-weight: var(--titleweight);
        line-height: 0.89;
        padding: 0;
        margin: var(--titlemargin);
        color: var(--dark);
      }
    `}</style>
  </>
)

export const SmallTitle = ({ children }: Props): JSX.Element => (
  <>
    <h2>{children}</h2>
    <style jsx>{`
      h2 {
        font-size: var(--bodysize);
        margin: 0;
        padding: 0;
        font-weight: var(--titleweight);
        line-height: 1em;
        text-transform: uppercase;
      }
    `}</style>
  </>
)
