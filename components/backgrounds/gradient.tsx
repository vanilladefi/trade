import React from 'react'

const Gradient = (): JSX.Element => (
  <>
    <div></div>
    <style jsx>{`
      div {
        background: var(--topgradient);
        z-index: -1;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `}</style>
  </>
)

export default Gradient
