import React from 'react'

export const TopGradient = (): JSX.Element => (
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

export const ModalGradient = (): JSX.Element => (
  <>
    <div></div>
    <style jsx>{`
      div {
        background: var(--tradeflowergradient);
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
