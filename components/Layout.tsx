import Head from 'next/head'
import React, { ReactNode } from 'react'
import { RecoilRoot } from 'recoil'
import { UseWalletProvider } from 'use-wallet'
import { chainId, rpcUrl } from 'utils/config'
import Footer from './Footer'
import GlobalStyles from './GlobalStyles'
import Header from './Header'
import { MobileWalletFloater } from './SmallWalletInfo'
import { WalletConnector } from './WalletConnector'
import WalletModal from './WalletModal'

type RenderFunction = () => ReactNode

type Props = {
  children?: ReactNode
  hero?: ReactNode
  heroRenderer?: RenderFunction
  title?: string
  description?: string
  shareImg?: string
  hideFromSearch?: boolean
}

const Layout = ({
  children,
  hero,
  heroRenderer,
  hideFromSearch,
  title = 'Start #ProfitMining',
  description = 'Vanilla Rewards You For Making a Profit In DeFi',
  shareImg = '/social/social-share-general.png',
}: Props): JSX.Element => {
  // Use useEffect side effect to gain access to windowURL for full URL
  // We could do this by defining base url in process specific .env -files as well
  // But then branch preview url's wouldn't probably work correctly?
  const [origin, setOrigin] = React.useState('')
  React.useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  return (
    <RecoilRoot>
      <UseWalletProvider
        chainId={chainId}
        connectors={{
          walletconnect: {
            rpcUrl: rpcUrl,
          },
        }}
      >
        <WalletConnector />

        {/* HTML <head> */}
        <Head>
          <title>{title} - Vanilla</title>
          <meta name='description' content={description}></meta>
          {hideFromSearch && <meta name='robots' content='noindex, nofollow' />}
          <meta charSet='utf-8' />
          <meta
            name='viewport'
            content='initial-scale=1.0, width=device-width'
          />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/favicon-16x16.png'
          />
          <link rel='manifest' href='/site.webmanifest' />
          <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#fd9b1e' />
          <meta name='msapplication-TileColor' content='#fd9b1e' />
          <meta name='theme-color' content='#ffffff' />
          <meta property='og:title' content={`${title} - Vanilla `} />
          <meta property='og:description' content={description} />
          <meta property='og:image' content={`${origin}${shareImg}`} />
          <script
            async
            defer
            data-domain='vanilladefi.com'
            src='https://plausible.io/js/plausible.js'
          ></script>
        </Head>

        <WalletModal />

        {/* Header, nav */}
        <Header renderChildren={heroRenderer}>{hero}</Header>

        {/* Site content */}
        {children}

        {/* Footer */}
        <Footer />

        {/* Mobile Wallet Floater */}
        <MobileWalletFloater />

        {/* Global CSS, like variables & fonts */}
        <GlobalStyles />
      </UseWalletProvider>
    </RecoilRoot>
  )
}

export default Layout
