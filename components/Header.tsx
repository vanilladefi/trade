import React, { ReactNode } from 'react'

import Link from 'next/link'
import { Logo } from './Brand'
import Navigation from './Navigation'
import Wrapper from './Wrapper'

type Props = {
  children?: ReactNode
}

const Header = ({ children, background }: Props) => (
  <>
    <header>
      <Wrapper>
        <div className="headerPadding">
          <div className="navBar">
            <Link href="/"><a><Logo /></a></Link>
            <Navigation />
          </div>
          {children}
        </div>
      </Wrapper>
    </header>
    <style jsx>{`
      div.navBar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 44px;
      }
      div.headerPadding {
        padding: var(--headerpadding);
      }
      header {
        display: flex;
        width: 100%;
        justify-content: center;
      }
    `}</style>
  </>
)

export default Header
