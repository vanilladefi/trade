import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const BottomFloater = ({ children }: Props): JSX.Element => {
  return (
    <>
      <div className='bottomFloater'>{children}</div>
      <style jsx>{`
        .bottomFloater {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: fit-content;
          display: flex;
          z-index: 3;
        }
      `}</style>
    </>
  )
}

export default BottomFloater
