import React from 'react'
//import Link from 'next/link'

import Wrapper from './Wrapper'
import Logo from './Logo'

const Footer = () => (
  <>
    <footer>
      <Wrapper>
        <Logo />
        <hr />
        <span>I'm here to stay (Footer)</span>
      </Wrapper>
    </footer>
    <div />
    <style jsx>{`
      footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: var(--dark);
        color: var(--white);
        width: 100%;
        font-size: 14px;
      }
      div {
        display: flex;
        width: 100%;
        flex-grow: 1;
        background: var(--dark);
      }
    `}</style>
  </>
)

export default Footer
