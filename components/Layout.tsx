import { ApolloProvider } from '@apollo/client/react/context'
import Head from 'next/head'
import React, { ReactNode } from 'react'
import { UseWalletProvider } from 'use-wallet'
import { client } from '../state/graphql'
import { WalletStateProvider, WalletConnector } from '../state/Wallet'
import Footer from './Footer'
import GlobalStyles from './GlobalStyles'
import Header from './Header'
import WalletModal from './WalletModal'

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
      chainId={1}
      connectors={{
        walletconnect: {
          rpcUrl:
            'https://mainnet.infura.io/v3/2b58be24601f4086baef24488838c239',
        },
      }}
    >
      <WalletStateProvider>
        <ApolloProvider client={client}>
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
          <Header children={hero} renderChildren={heroRenderer} />

          {/* Site content */}
          {children}

          {/* Footer */}
          <Footer />

          {/* Global CSS, like variables & fonts */}
          <GlobalStyles />
        </ApolloProvider>
      </WalletStateProvider>
    </UseWalletProvider>
  )
}

export default Layout
