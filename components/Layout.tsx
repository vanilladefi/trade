import React, { ReactNode } from 'react'
import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'
import GlobalStyles from './GlobalStyles'
import Wrapper from './Wrapper'

type Props = {
  children?: ReactNode,
  hero?: ReactNode,
  title?: string
}

const Layout = ({ children, hero, title = 'Vanilla' }: Props) => (
  <>
    {/* HTML <head> */}
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    {/* Header, nav */}
    <Header children={hero} />

    {/* Site content */}
    {children}

    {/* Footer */}
    <Footer />

    {/* Global CSS, like variables & fonts */}
    <GlobalStyles />
  </>
)

export default Layout
