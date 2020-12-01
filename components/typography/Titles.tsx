import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

export const LandingTitle = ({ children }: Props): JSX.Element => (
  <>
    <h1>{children}</h1>
    <style jsx>{`
      h1 {
        font-size: var(--landing-hugetitlesize);
        font-weight: var(--titleweight);
        line-height: 1em;
        padding: 0;
        margin: var(--landing-titlemargin);
      }
    `}</style>
  </>
)

export const BoxTitle = ({ children }: Props): JSX.Element => (
  <>
    <h1>{children}</h1>
    <style jsx>{`
      h1 {
        font-size: var(--boxtitlesize);
        font-weight: var(--titleweight);
        line-height: 65px;
        padding: 0;
        margin: var(--box-titlemargin);
      }
    `}</style>
  </>
)

export const HugeTitle = ({ children }: Props): JSX.Element => (
  <>
    <h1>{children}</h1>
    <style jsx>{`
      h1 {
        font-size: var(--hugetitlesize);
        font-weight: var(--titleweight);
        line-height: 1em;
        padding: 0;
        margin: var(--landing-titlemargin);
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
      }
    `}</style>
  </>
)
