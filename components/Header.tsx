import Link from 'next/link'
import { Logo } from './Brand'
import { DesktopNavigation, MobileNavigation } from './Navigation'
import Wrapper from './Wrapper'
import { BreakPoint } from './GlobalStyles/Breakpoints'

type RenderFunction = () => React.ReactNode

interface Props {
  background?: React.ReactNode
  renderChildren?: RenderFunction
}

const Header = ({
  children,
  background,
  renderChildren,
}: React.PropsWithChildren<Props>): JSX.Element => {
  return (
    <>
      <header>
        {background}
        <Wrapper>
          <div className='headerPadding'>
            <div className='navBar'>
              <Link href='/'>
                <a className='logo'>
                  <Logo />
                </a>
              </Link>
              <div className='mobileNav'>
                <MobileNavigation />
              </div>
              <div className='desktopNav'>
                <DesktopNavigation />
              </div>
            </div>
            {children || (renderChildren && renderChildren())}
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
