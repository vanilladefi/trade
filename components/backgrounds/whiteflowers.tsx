import React from 'react'

const WhiteFlowers = (): JSX.Element => (
  <>
    <div></div>
    <style jsx>{`
      div {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('/images/white_flowers.svg');
        background-repeat: no-repeat;
        background-position: -40px center;
        background-size: auto 550px;
        mix-blend-mode: screen;
      }
    `}</style>
  </>
)

export default WhiteFlowers
