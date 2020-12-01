import React, { ReactNode } from 'react'
import classNames from 'classnames'

export enum ButtonColor {
  GRADIENT,
  DARK,
  TRANSPARENT,
}

export enum Rounding {
  ALL,
  TOPLEFT,
  TOPRIGHT,
  BOTTOMRIGHT,
  BOTTOMLEFT,
}

type Props = {
  children?: ReactNode
  large?: boolean
  color?: ButtonColor
  rounded?: Rounding
  injectedStyles?: string
}

const Button = ({
  children,
  large,
  color = ButtonColor.GRADIENT,
  rounded = Rounding.ALL,
  injectedStyles,
}: Props): JSX.Element => {
  const buttonClass = classNames({
    large: large,
    gradient: color === ButtonColor.GRADIENT,
    dark: color === ButtonColor.DARK,
    transparent: color === ButtonColor.TRANSPARENT,
    'roundedTopLeft roundedTopRight roundedBottomRight roundedBottomLeft':
      rounded === Rounding.ALL,
  })
  return (
    <>
      <button className={buttonClass}>{children}</button>
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
        }
        button.transparent {
          background: transparent;
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
        ${injectedStyles}
      `}</style>
    </>
  )
}

export default Button
