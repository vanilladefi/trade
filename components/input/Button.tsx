import classNames from 'classnames'
import { Spinner } from 'components/Spinner'
import Icon, { IconUrls } from 'components/typography/Icon'
import React, { MouseEventHandler, ReactNode } from 'react'
import { Alignment, Justification } from '../grid/Flex'

export enum ButtonColor {
  GRADIENT,
  DARK,
  TRANSPARENT,
  WHITE,
}

export enum ButtonSize {
  XSMALL = 'xsmall',
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

export enum Opacity {
  OPAQUE,
  SEETHROUGH,
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

export enum ButtonState {
  NORMAL,
  LOADING,
  SUCCESS,
}

type Callback = MouseEventHandler<HTMLButtonElement>

export type ButtonProps = {
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
  buttonState?: ButtonState
  disabled?: boolean
  opacity?: Opacity
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
  buttonState = ButtonState.NORMAL,
  disabled,
  opacity,
}: ButtonProps): JSX.Element => {
  const buttonClass = classNames({
    [`${size}`]: true,
    gradient: color === ButtonColor.GRADIENT,
    dark: color === ButtonColor.DARK,
    transparent: color === ButtonColor.TRANSPARENT,
    white: color === ButtonColor.WHITE,
    bordered: bordered,
    noRightBorder: noRightBorder,
    disabled: disabled,
    seeThrough: opacity === Opacity.SEETHROUGH,
    'roundedTopLeft roundedTopRight roundedBottomRight roundedBottomLeft':
      rounded === Rounding.ALL,
    'roundedTopLeft roundedTopRight': rounded === Rounding.TOP,
    'roundedBottomLeft roundedBottomRight': rounded === Rounding.BOTTOM,
    'roundedTopLeft roundedBottomLeft': rounded === Rounding.LEFT,
    'roundedTopRight roundedBottomRight': rounded === Rounding.RIGHT,
  })
  const StateIndicator = (): JSX.Element => {
    const Wrapper = ({ children }: Props) => (
      <div>
        {children}
        <style jsx>{`
          div {
            display: flex;
            position: absolute;
            height: fit-content;
            width: fit-content;
            left: 1.4rem;
            --iconsize: 1.6rem;
            margin-top: -0.8rem;
            top: 50%;
          }
        `}</style>
      </div>
    )
    switch (buttonState) {
      case ButtonState.NORMAL:
        return <></>
      case ButtonState.LOADING:
        return (
          <Wrapper>
            <Spinner />
          </Wrapper>
        )
      case ButtonState.SUCCESS:
        return (
          <Wrapper>
            <Icon src={IconUrls.CHECK} />
          </Wrapper>
        )
      default:
        return <></>
    }
  }
  return (
    <>
      <button
        className={buttonClass}
        onClick={!disabled ? onClick : () => null}
        title={title}
      >
        <StateIndicator />
        {children}
      </button>
      <style jsx>{`
        button {
          display: flex;
          box-sizing: border-box;
          padding: var(--buttonpadding);
          margin: var(--buttonmargin);
          border: 0;
          min-width: 40px;
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
          position: relative;
          opacity: 1;
          transition: 0.3s ease box-shadow, 0.3s ease opacity;
          max-width: 100%;
        }
        button.large {
          padding: var(--largebuttonpadding);
          font-size: var(--largebuttonsize);
        }
        button.xsmall {
          padding: var(--xsmallbuttonpadding);
          font-size: var(--xsmallbuttonsize);
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
        button.disabled {
          opacity: 0.8;
          cursor: wait;
        }
        button.bordered {
          border-width: 2px;
          border-style: solid;
          border-image: var(--bordercolor);
        }
        button.seeThrough {
          opacity: 0.3;
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
        button:hover :not(.bordered) {
          box-shadow: 0 0 0px 2px var(--dark);
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
