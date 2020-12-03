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
  className?: string
  gap?: string
}

/**
 * CSS3 Flexbox Column
 *
 * @param children React children
 * @param width taken flex-basis of the column on a 12-column grid. e.g. Width.FIVE. Defaults to Width.TWELVE
 * @param className regular React className for CSS variable scoping to work
 */
export const Column = ({
  children,
  width = Width.TWELVE,
  className,
}: Props): JSX.Element => (
  <>
    <div className={className}>{children}</div>
    <style jsx>{`
      div {
        display: flex;
        position: relative;
        flex-direction: column;
        flex-basis: ${((width + 1) / 12) * 100}%;
        align-items: flex-start;
        justify-content: flex-start;
      }
    `}</style>
  </>
)

/**
 * CSS3 Flexbox Row
 *
 * @param children React children
 * @param className regular React className for CSS variable scoping to work
 * @param gap CSS gap property
 */
export const Row = ({ children, className, gap }: Props): JSX.Element => (
  <>
    <div className={className}>{children}</div>
    <style jsx>{`
      div {
        display: flex;
        position: relative;
        width: 100%;
        flex-direction: row;
        flex-flow: row wrap;
        gap: ${gap ? gap : '0px'};
      }
    `}</style>
  </>
)
