import classNames from 'classnames'
import React, { ReactNode } from 'react'

export enum ButtonColor {
  GRADIENT,
  DARK,
  TRANSPARENT,
  WHITE,
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
  large?: boolean
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
}

const Button = ({
  children,
  large,
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
}: Props): JSX.Element => {
  const buttonClass = classNames({
    large: large,
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
          justify-content: center;
          align-items: center;
          padding: var(--buttonpadding);
          margin: var(--buttonmargin);
          border: 0;
          font-family: var(--bodyfont);
          font-size: var(--buttonsize);
          font-weight: var(--buttonweight);
          outline: 0;
          cursor: pointer;
          line-height: 5px;
          ${width ? 'width: ' + width : ''}
          ${height ? 'height: ' + height : ''}
          ${overflow ? overflow : ''}
        }
        button.large {
          padding: var(--largebuttonpadding);
          font-size: var(--largebuttonsize);
        }
        button.gradient {
          background: var(--buttongradient);
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

export const ButtonGroup = ({ children }: Props): JSX.Element => (
  <>
    <div className='buttonGroup'>{children}</div>
    <style jsx>{`
      .buttonGroup {
        display: flex;
        flex-direction: row;
      }
    `}</style>
  </>
)

export default Button
