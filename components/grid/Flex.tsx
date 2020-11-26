import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

export const Column = ({ children }: Props): JSX.Element => (
  <>
    <div>{children}</div>
    <style jsx>{`
      div {
        display: flex;
        flex-direction: column;
      }
    `}</style>
  </>
)
