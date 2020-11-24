import React, { ReactNode } from 'react'

import Link from 'next/link'
import Logo from './Logo'
import Navigation from './Navigation'
import Wrapper from './Wrapper'

type Props = {
  children?: ReactNode
}

const Header = ({ children }: Props) => (
  <>
    <header>
      <Wrapper>
        <div>
          <Link href="/"><a><Logo /></a></Link>
          <Navigation />
        </div>
        {children}
      </Wrapper>
    </header>
    <style jsx>{`
      div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 44px;
      }
      header {
        display: flex;
        padding-top: var(--outermargin);
        width: 100%;
        justify-content: center;
      }
    `}</style>
  </>
)

export default Header
