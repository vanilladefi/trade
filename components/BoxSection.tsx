import React, { ReactNode } from 'react'
import classNames from 'classnames'

export enum Color {
  WHITE,
  DARK,
  GRADIENT,
}

type Props = {
  children?: ReactNode
  color?: Color
}

const BoxSection = ({ children, color = Color.WHITE }: Props): JSX.Element => {
  const boxClass = classNames('boxSection', {
    white: color === Color.WHITE,
    dark: color === Color.DARK,
    gradient: color === Color.GRADIENT,
  })
  return (
    <>
      <section className={boxClass}>{children}</section>
      <style jsx>{`
        section {
          display: flex;
          width: 100%;
          margin-bottom: var(--layoutmargin);
          font-size: var(--boxbodysize);
          padding: var(--boxpadding);
        }
        section.white {
          background: var(--white);
          color: var(--dark);
        }
        section.dark {
          background: var(--dark);
          color: var(--white);
        }
        section.gradient {
          background: var(--boxgradient);
          color: var(--dark);
        }
      `}</style>
    </>
  )
}

export default BoxSection
