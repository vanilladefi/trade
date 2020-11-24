import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

const Wrapper = ({ children }: Props) => (
  <>
    <button>
      {children}
    </button>
    <style jsx>{`
    button {
      display: flex;
      margin-bottom: var(--outermargin);
      flex-direction: column;
      width: 100%;
      max-width: var(--maxlayoutwidth);
      padding: 0px var(--outermargin);
    }
  `}</style>
  </>
)

export default Wrapper
