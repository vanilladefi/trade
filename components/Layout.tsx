import Head from 'next/head'
import React, { ReactNode } from 'react'
import Footer from './Footer'
import GlobalStyles from './GlobalStyles'
import Header from './Header'
import { WalletProvider } from './state/Wallet'
import WalletModal from './WalletModal'

type Props = {
  children?: ReactNode
  hero?: ReactNode
  title?: string
}

const Layout = ({ children, hero, title = 'Vanilla' }: Props): JSX.Element => {
  return (
    <WalletProvider>
      {/* HTML <head> */}
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>

      <WalletModal />

      {/* Header, nav */}
      <Header children={hero} />

      {/* Site content */}
      {children}

      {/* Footer */}
      <Footer />

      {/* Global CSS, like variables & fonts */}
      <GlobalStyles />
    </WalletProvider>
  )
}

export default Layout
