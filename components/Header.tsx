import Link from 'next/link'
import { AnimatePresence, motion, useCycle } from 'framer-motion'
import React, { ReactNode, useRef } from 'react'
import { Logo } from './Brand'
import MenuToggle from './MenuToggle'
import Navigation from './Navigation'
import Wrapper from './Wrapper'

type Props = {
  children?: ReactNode
  background?: ReactNode
}

const MobileNavigation = (): JSX.Element => {
  const [isOpen, toggleOpen] = useCycle(false, true)
  const containerRef = useRef(null)
  return (
    <>
      <motion.div animate={isOpen ? 'open' : 'closed'} ref={containerRef}>
        <MenuToggle toggle={() => toggleOpen()} />
      </motion.div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key='container'
            className='mobileNavContainer'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: '0',
              bottom: '0',
              left: '0',
              right: '0',
              display: 'flex',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: '4',
            }}
          >
            <div
              onClick={() => toggleOpen()}
              style={{
                position: 'fixed',
                top: '0',
                bottom: '0',
                left: '0',
                width: 'calc(100% - 240px)',
                boxSizing: 'border-box',
                backgroundColor: 'transparent',
                display: 'flex',
                height: '100vh',
              }}
            ></div>
            <motion.div
              key='sidebar'
              initial={{ right: -440 }}
              animate={{ right: 0.1 }} // framer-motion does not handle animate to right 0 very well for some reason
              exit={{ right: -440 }}
              transition={{ type: 'tween' }}
              onClick={null}
              style={{
                position: 'fixed',
                top: '0',
                bottom: '0',
                width: '240px',
                boxSizing: 'border-box',
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                height: '100vh',
              }}
            >
              <Navigation />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const Header = ({ children, background }: Props): JSX.Element => {
  return (
    <>
      <header>
        {background}
        <Wrapper>
          <div className='headerPadding'>
            <div className='navBar'>
              <Link href='/'>
                <a>
                  <Logo />
                </a>
              </Link>
              <div className='mobileNav'>
                <MobileNavigation />
              </div>
              <div className='desktopNav'>
                <Navigation />
              </div>
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
          position: relative;
          width: 100%;
          justify-content: center;
        }
        div.desktopNav {
          display: none;
        }
        @media (min-width: 680px) {
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
