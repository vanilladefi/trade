import React, { ReactNode } from 'react'

export enum Width {
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
  TEN,
  ELEVEN,
  TWELVE,
}

type Props = {
  children?: ReactNode
  width?: Width
}

export const Column = ({
  children,
  width = Width.TWELVE,
}: Props): JSX.Element => (
  <>
    <div>{children}</div>
    <style jsx>{`
      div {
        display: flex;
        flex-direction: column;
        flex-basis: ${((width + 1) / 12) * 100}%;
        align-items: flex-start;
        justify-content: flex-start;
      }
    `}</style>
  </>
)

export const Row = ({ children }: Props): JSX.Element => (
  <>
    <div>{children}</div>
    <style jsx>{`
      div {
        display: flex;
        flex-direction: row;
        flex-flow: row wrap;
      }
    `}</style>
  </>
)
