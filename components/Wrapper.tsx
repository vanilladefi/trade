import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
  className?: string
}

const Wrapper: React.FC<Props> = ({ children, className }: Props) => (
  <>
    <div className={className}>{children}</div>
    <style jsx>{`
      div {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: var(--maxlayoutwidth);
        padding: 0px var(--outermargin);
      }
    `}</style>
  </>
)

export default Wrapper
