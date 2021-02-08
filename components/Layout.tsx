import Head from 'next/head'
import React, { ReactNode } from 'react'
import { UseWalletProvider } from 'use-wallet'
import { RecoilRoot } from 'recoil'
import { WalletStateProvider, WalletConnector } from '../state/Wallet'
import Footer from './Footer'
import GlobalStyles from './GlobalStyles'
import Header from './Header'
import WalletModal from './WalletModal'
import { MobileWalletFloater } from './SmallWalletInfo'
import { chainId, rpcUrl } from 'utils/config'

type RenderFunction = () => ReactNode

type Props = {
  children?: ReactNode
  hero?: ReactNode
  heroRenderer?: RenderFunction
  title?: string
}

const Layout = ({
  children,
  hero,
  heroRenderer,
  title = 'Vanilla',
}: Props): JSX.Element => {
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
        <WalletStateProvider>
          <WalletConnector />

          {/* HTML <head> */}
          <Head>
            <title>{title}</title>
            <meta charSet='utf-8' />
            <meta
              name='viewport'
              content='initial-scale=1.0, width=device-width'
            />
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
        </WalletStateProvider>
      </UseWalletProvider>
    </RecoilRoot>
  )
}

export default Layout
