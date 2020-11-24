import React, { ReactNode } from 'react'
import Link from 'next/link'

import Wrapper from './Wrapper'
import Logo from './Logo'

type Props = {
  children?: ReactNode
}

const Footer = () => (
  <>
    <footer>
      <Wrapper>
        <Logo />
        <hr />
        <span>I'm here to stay (Footer)</span>
      </Wrapper>
    </footer>
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
    `}</style>
  </>
)

export default Footer
