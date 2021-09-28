import Link from 'next/link'
import React from 'react'
import { PrerenderProps } from 'types/content'
import { Logo } from './Brand'
import { BreakPoint } from './GlobalStyles/Breakpoints'
import { DesktopNavigation, MobileNavigation } from './Navigation'
import Wrapper from './Wrapper'

type RenderFunction = () => React.ReactNode

type Props = PrerenderProps & {
  background?: React.ReactNode
  renderChildren?: RenderFunction
  children?: React.ReactNode
}

const Header = ({
  children,
  background,
  renderChildren,
  ...rest
}: React.PropsWithChildren<Props>): JSX.Element => {
  return (
    <>
      <header>
        {background}
        <div className='headerPadding'>
          <Wrapper>
            <div className='innerPadding'>
              <div className='navBar'>
                <Link href={`/${rest.walletAddress}`}>
                  <a className='logo'>
                    <Logo />
                  </a>
                </Link>
                <div className='mobileNav'>
                  <MobileNavigation {...rest} />
                </div>
                <div className='desktopNav'>
                  <DesktopNavigation {...rest} />
                </div>
              </div>
            </div>
          </Wrapper>
          {children || (renderChildren && renderChildren())}
        </div>
      </header>
      <style jsx>{`
        div.navBar {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          height: 44px;
        }
        div.innerPadding {
          padding: var(--headerpadding);
        }
        div.headerPadding {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        header {
          display: flex;
          position: relative;
          width: 100%;
          justify-content: center;
          padding-top: 1rem;
        }
        div.desktopNav {
          display: none;
        }
        .logo {
          margin-right: 2rem;
        }
        @media (min-width: ${BreakPoint.mobileNav}px) {
          div.mobileNav {
            display: none;
          }
          div.desktopNav {
            display: block;
          }
        }
      `}</style>
    </>
  )
}

export default Header
