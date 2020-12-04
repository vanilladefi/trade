import React from 'react'

const HandFlower = (): JSX.Element => (
  <>
    <div></div>
    <style jsx>{`
      div {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('/images/handFlower.png');
        background-repeat: no-repeat;
        background-position: -100px 100px;
        mix-blend-mode: screen;
        background-size: auto 700px;
      }
    `}</style>
  </>
)

export default HandFlower
