import classNames from 'classnames'
import React, { ReactNode } from 'react'
import { Justification, Alignment } from '../grid/Flex'

export enum ButtonColor {
  GRADIENT,
  DARK,
  TRANSPARENT,
  WHITE,
}

export enum ButtonSize {
  SMALL = 'small',
  NORMAL = 'normal',
  LARGE = 'large',
}

export enum Rounding {
  ALL,
  LEFT,
  RIGHT,
  TOP,
  BOTTOM,
  TOPLEFT,
  TOPRIGHT,
  BOTTOMRIGHT,
  BOTTOMLEFT,
}

export enum Overflow {
  AUTO = 'overflow: auto;',
  HIDDEN = 'overflow: hidden;',
  ELLIPSIS = `
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `,
}

type Callback = () => void

type Props = {
  children?: ReactNode
  size?: ButtonSize
  color?: ButtonColor
  bordered?: boolean
  noRightBorder?: boolean
  rounded?: Rounding
  overflow?: Overflow
  width?: string
  height?: string
  injectedStyles?: string
  onClick?: Callback
  title?: string
  grow?: boolean
  justifyContent?: Justification
  alignItems?: Alignment
}

const Button = ({
  children,
  size = ButtonSize.NORMAL,
  color = ButtonColor.GRADIENT,
  rounded = Rounding.ALL,
  bordered = false,
  noRightBorder = false,
  overflow,
  width,
  height,
  injectedStyles,
  onClick,
  title,
  grow,
  alignItems = Alignment.CENTER,
  justifyContent = Justification.CENTER,
}: Props): JSX.Element => {
  const buttonClass = classNames({
    [`${size}`]: true,
    gradient: color === ButtonColor.GRADIENT,
    dark: color === ButtonColor.DARK,
    transparent: color === ButtonColor.TRANSPARENT,
    white: color === ButtonColor.WHITE,
    bordered: bordered,
    noRightBorder: noRightBorder,
    'roundedTopLeft roundedTopRight roundedBottomRight roundedBottomLeft':
      rounded === Rounding.ALL,
    'roundedTopLeft roundedTopRight': rounded === Rounding.TOP,
    'roundedBottomLeft roundedBottomRight': rounded === Rounding.BOTTOM,
    'roundedTopLeft roundedBottomLeft': rounded === Rounding.LEFT,
    'roundedTopRight roundedBottomRight': rounded === Rounding.RIGHT,
  })
  return (
    <>
      <button className={buttonClass} onClick={onClick} title={title}>
        {children}
      </button>
      <style jsx>{`
        button {
          display: flex;
          padding: var(--buttonpadding);
          margin: var(--buttonmargin);
          border: 0;
          font-family: var(--bodyfont);
          font-size: var(--buttonsize);
          font-weight: var(--buttonweight);
          color: inherit;
          outline: 0;
          cursor: pointer;
          line-height: 1rem;
          ${width ? 'width: ' + width : ''}
          ${height ? 'height: ' + height : ''}
          ${overflow ? overflow : ''}
          ${grow ? 'flex-grow: 1;' : 'flex-grow: 0;'}
          align-items: ${alignItems};
          justify-content: ${justifyContent};
        }
        button.large {
          padding: var(--largebuttonpadding);
          font-size: var(--largebuttonsize);
        }
        button.small {
          padding: var(--smallbuttonpadding);
          font-size: var(--smallbuttonsize);
        }
        button.gradient {
          background: var(--buttongradient);
          color: var(--dark);
        }
        button.dark {
          background: var(--dark);
          color: var(--white);
        }
        button.white {
          background: var(--white);
        }
        button.transparent {
          background: transparent;
        }
        button.bordered {
          border: 3px solid var(--dark);
        }
        button.roundedTopLeft {
          border-top-left-radius: 9999px;
        }
        button.roundedTopRight {
          border-top-right-radius: 9999px;
        }
        button.roundedBottomLeft {
          border-bottom-left-radius: 9999px;
        }
        button.roundedBottomRight {
          border-bottom-right-radius: 9999px;
        }
        button.noRightBorder {
          border-right-width: 0;
        }
        ${injectedStyles}
      `}</style>
    </>
  )
}

export const ButtonGroup = ({ children, grow }: Props): JSX.Element => (
  <>
    <div className='buttonGroup'>{children}</div>
    <style jsx>{`
      .buttonGroup {
        display: flex;
        flex-direction: row;
        ${grow ? 'flex-grow: 1;' : 'flex-grow: 0;'}
      }
    `}</style>
  </>
)

export default Button
