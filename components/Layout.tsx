import Header from 'components/Header'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import React, { ReactNode, useEffect, useState } from 'react'
import { RecoilRoot } from 'recoil'
import { PrerenderProps } from 'types/content'
import { UseWalletProvider } from 'use-wallet'
import { chainId, rpcUrl } from 'utils/config'

const GlobalStyles = dynamic(import('components/GlobalStyles'))
const Footer = dynamic(import('components/Footer'))
const WalletModal = dynamic(import('components/WalletModal'))

const MobileWalletFloater = dynamic(() =>
  import('components/SmallWalletInfo').then((mod) => mod.MobileWalletFloater),
)

type RenderFunction = () => ReactNode

export type LayoutProps = PrerenderProps & {
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
  ethBalance,
  vnlBalance,
  walletAddress,
}: LayoutProps): JSX.Element => {
  // Use useEffect side effect to gain access to windowURL for full URL
  // We could do this by defining base url in process specific .env -files as well
  // But then branch preview url's wouldn't probably work correctly?
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    background: setOrigin(window.location.origin)
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
        {/* HTML <head> */}
        <Head>
          <title>{title} - Vanilla</title>
          <meta name='description' content={description}></meta>
          <meta
            name='viewport'
            content='initial-scale=1.0, width=device-width'
          />
          {hideFromSearch && <meta name='robots' content='noindex, nofollow' />}
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
        <Header
          renderChildren={heroRenderer}
          ethBalance={ethBalance}
          vnlBalance={vnlBalance}
        >
          {hero}
        </Header>

        {/* Site content */}
        {children}

        {/* Footer */}
        <Footer
          walletAddress={walletAddress}
          ethBalance={ethBalance}
          vnlBalance={vnlBalance}
        />

        {/* Mobile Wallet Floater */}
        <MobileWalletFloater />

        {/* Global CSS, like variables & fonts */}
        <GlobalStyles />
      </UseWalletProvider>
    </RecoilRoot>
  )
}

export default Layout
