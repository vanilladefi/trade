import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

export const Title: React.FC<Props> = ({ children }: Props) => (
  <>
    <h1>{children}</h1>
    <style jsx>{`
      h1 {
        font-size: var(--titlesize);
        font-weight: var(--titleweight);
        line-height: 0.89;
        padding: 0;
        margin: var(--titlemargin);
      }
    `}</style>
  </>
)

export const MediumTitle: React.FC<Props> = ({ children }: Props) => (
  <>
    <h1>{children}</h1>
    <style jsx>{`
      h1 {
        font-size: var(--medium-titlesize);
        font-weight: var(--titleweight);
        line-height: 0.89;
        padding: 0;
        margin: var(--medium-titlemargin);
      }
    `}</style>
  </>
)

export const SmallTitle: React.FC<Props> = ({ children }: Props) => (
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
