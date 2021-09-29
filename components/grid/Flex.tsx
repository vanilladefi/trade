import React, { CSSProperties, ReactNode } from 'react'

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

export enum Justification {
  START = 'flex-start',
  CENTER = 'center',
  SPACE_BETWEEN = 'space-between',
  SPACE_AROUND = 'space-around',
  SPACE_EVENLY = 'space-evenly',
  END = 'flex-end',
}

export enum Alignment {
  START = 'flex-start',
  CENTER = 'center',
  STRETCH = 'stretch',
  END = 'flex-end',
}

type Props = {
  children?: ReactNode
  width?: Width
  className?: string
  style?: CSSProperties
  gap?: string
  grow?: boolean
  shrink?: boolean
  overflowY?: string
  justifyContent?: Justification
  alignItems?: Alignment
}

/**
 * CSS3 Flexbox Column
 *
 * @param children React children
 * @param width taken flex-basis of the column on a 12-column grid. e.g. Width.FIVE.
 * @param className regular React className for CSS variable scoping to work
 */
export const Column: React.FC<Props> = ({
  children,
  width,
  className,
  style,
  grow = false,
  shrink = true,
  overflowY,
  alignItems = Alignment.START,
  justifyContent = Justification.START,
}: Props): JSX.Element => (
  <>
    <div className={className} style={style}>
      {children}
    </div>
    <style jsx>{`
      div {
        display: flex;
        position: relative;
        flex-direction: column;
        ${width ? `flex-basis: ${((width + 1) / 12) * 100}%;` : ''}
        ${grow ? 'flex-grow: 1;' : 'flex-grow: 0;'}
        ${shrink ? 'flex-shrink: 1;' : 'flex-shrink: 0;'}
        ${overflowY ? 'overflow-y: ' + overflowY + ';' : ''}
        align-items: ${alignItems};
        justify-content: ${justifyContent};
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
export const Row: React.FC<Props> = ({
  children,
  className,
  gap,
  alignItems = Alignment.START,
  justifyContent = Justification.START,
}: Props): JSX.Element => (
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
        align-items: ${alignItems};
        justify-content: ${justifyContent};
      }
    `}</style>
  </>
)
