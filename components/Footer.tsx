import React from 'react'
import { Logo } from './Brand'
//import Link from 'next/link'
import Wrapper from './Wrapper'

const Footer = (): JSX.Element => (
  <>
    <footer>
      <Wrapper>
        <Logo white />
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
        padding: var(--boxpadding);
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
