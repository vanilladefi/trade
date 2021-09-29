/* eslint-disable prefer-const */
import { providers } from 'ethers'
import { useEffect } from 'react'
import { useRecoilCallback, useSetRecoilState } from 'recoil'
import {
  providerState,
  signerState,
  storedWalletConnectorState,
} from 'state/wallet'
import { useWallet, Wallet } from 'use-wallet'
import { network, useWebsocketRpc } from 'utils/config'
import { apiKey } from 'utils/config/secrets'

type JsonRpcWallet = Wallet<providers.JsonRpcProvider>

const WalletConnector = (): (() => Promise<void>) => {
  const {
    status,
    error,
    connect,
    reset,
    type: walletType,
    connector,
    ethereum,
  } = useWallet<JsonRpcWallet>()
  const setStoredWalletConnector = useSetRecoilState(storedWalletConnectorState)
  const setSigner = useSetRecoilState(signerState)
  const setProvider = useSetRecoilState(providerState)

  const connectWallet = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const stored = await snapshot.getPromise(storedWalletConnectorState)
        console.log('Walletconnector called!', walletType, stored, status)
        if (!walletType && status === 'disconnected' && stored) connect(stored)
      },
    [walletType, status, connect],
  )

  useEffect(() => {
    console.log('useEffect fired in walletConnector', status)
    if (ethereum) {
      let ethersProvider:
        | providers.AlchemyWebSocketProvider
        | providers.AlchemyProvider
        | providers.Web3Provider
        | providers.WebSocketProvider
      let ethersSigner: providers.JsonRpcSigner

      if (useWebsocketRpc && apiKey) {
        ethersProvider = new providers.AlchemyWebSocketProvider(network, apiKey)
      } else if (apiKey) {
        ethersProvider = new providers.AlchemyProvider(network, apiKey)
      } else if (useWebsocketRpc) {
        ethersProvider = new providers.WebSocketProvider(
          'ws://localhost:8545',
          network,
        )
      } else {
        ethersProvider = new providers.Web3Provider(
          ethereum as providers.ExternalProvider,
          network,
        )
      }

      ethersSigner = new providers.Web3Provider(
        ethereum as providers.ExternalProvider,
        network,
      ).getSigner()

      setProvider(ethersProvider)
      setSigner(ethersSigner)
    } else {
      setSigner(null)
    }
  }, [ethereum, setSigner, setProvider])

  useEffect(() => {
    setStoredWalletConnector(connector)
  }, [setStoredWalletConnector, connector])

  useEffect(() => {
    if (status === 'error') reset()
  }, [status, reset, error])

  return connectWallet
}

export default WalletConnector
