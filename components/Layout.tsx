import Head from 'next/head'
import React, { ReactNode } from 'react'
import { UseWalletProvider } from 'use-wallet'
import { WalletConnector, WalletStateProvider } from '../state/Wallet'
import Footer from './Footer'
import GlobalStyles from './GlobalStyles'
import Header from './Header'
import WalletModal from './WalletModal'
import { MobileWalletFloater } from './SmallWalletInfo'

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
    <UseWalletProvider
      chainId={parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '1')}
      connectors={{
        walletconnect: {
          rpcUrl:
            process.env.NEXT_PUBLIC_RPC_URL ||
            'https://mainnet.infura.io/v3/2b58be24601f4086baef24488838c239',
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
  )
}

export default Layout
