import { AnimatePresence, motion, useCycle } from 'framer-motion'
import { PrerenderProps } from 'types/content'
import MenuToggle from './MenuToggle'
import NavLink from './NavLink'
import SmallWalletInfo from './SmallWalletInfo'

function NavLinks(props: PrerenderProps) {
  return (
    <>
      <NavLink href={`/${props.walletAddress ? props.walletAddress : ''}`}>
        Home
      </NavLink>
      <NavLink
        href={`/${props.walletAddress ? props.walletAddress + '/' : ''}trade`}
      >
        Trade
      </NavLink>
      <NavLink
        href={`/${props.walletAddress ? props.walletAddress + '/' : ''}faq`}
      >
        FAQ
      </NavLink>
      <NavLink href='https://community.vanilladefi.com'>Community</NavLink>
    </>
  )
}

export const DesktopNavigation = (props: PrerenderProps): JSX.Element => {
  return (
    <nav>
      <NavLinks {...props} />
      <SmallWalletInfo {...props} />
      <style jsx>{`
        nav {
          display: flex;
          flex-direction: row;
          height: 100%;
          padding: 0;
          justify-content: center;
          align-items: center;
          line-height: 1rem;
        }
      `}</style>
    </nav>
  )
}

export const MobileNavigation = (props: PrerenderProps): JSX.Element => {
  const [isOpen, toggleOpen] = useCycle(false, true)

  return (
    <>
      <motion.div
        className='mobileNavToggleContainer'
        animate={isOpen ? 'open' : 'closed'}
      >
        <MenuToggle toggle={() => toggleOpen()} />
      </motion.div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.nav
            key='container'
            className='mobileNavContainer'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backgdrop */}
            <div className='mobileNavBackdrop' onClick={() => toggleOpen()} />

            {/* Navigation */}
            <motion.div
              key='sidebar'
              className='mobileNavContent'
              initial={{ right: -440 }}
              animate={{ right: 0.1 }} // framer-motion does not handle animate to right 0 very well for some reason
              exit={{ right: -440 }}
              transition={{ type: 'tween' }}
            >
              <NavLinks {...props} />
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
      <style jsx global>{`
        .mobileNavContainer {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 4;
        }
        .mobileNavBackdrop {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          width: calc(100% - 240px);
          box-sizing: border-box;
          background-color: transparent;
          display: flex;
          height: 100vh;
        }
        .mobileNavContent {
          position: fixed;
          top: 0;
          bottom: 0;
          width: 240px;
          box-sizing: border-box;
          background-color: #fff;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          height: 100vh;
          padding: 6rem 2rem;
        }
        .mobileNavContent a {
          padding: 0.7rem 0;
        }
      `}</style>
    </>
  )
}
