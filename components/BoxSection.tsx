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
  nosidepadding?: boolean
}

const BoxSection = ({
  children,
  color = Color.WHITE,
  nosidepadding,
}: Props): JSX.Element => {
  const boxClass = classNames('boxSection', {
    white: color === Color.WHITE,
    dark: color === Color.DARK,
    gradient: color === Color.GRADIENT,
    nosidepadding: nosidepadding === true,
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
          line-height: var(--boxlineheight);
          --titlesize: var(--boxtitlesize);
          --titlemargin: var(--box-titlemargin);
          --hugemonomargin: var(--box-hugemonomargin);
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
        section.nosidepadding {
          padding-left: 0;
          padding-right: 0;
        }
      `}</style>
    </>
  )
}

export default BoxSection
