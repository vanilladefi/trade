import { providers } from 'ethers'
import { useEffect } from 'react'
import { useRecoilCallback, useSetRecoilState } from 'recoil'
import {
  providerState,
  signerState,
  storedWalletConnectorState,
} from 'state/wallet'
import { useWallet, Wallet } from 'use-wallet'
import { apiKey } from 'utils/config'

type JsonRpcWallet = Wallet<providers.JsonRpcProvider>

const WalletConnector = (): null => {
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

  const initialLoad = useRecoilCallback(
    ({ snapshot }) => async () => {
      const stored = await snapshot.getPromise(storedWalletConnectorState)
      if (!walletType && status === 'disconnected' && stored) connect(stored)
    },
    [walletType, status, connect],
  )

  useEffect(() => {
    if (ethereum) {
      let ethersProvider:
        | providers.AlchemyWebSocketProvider
        | providers.Web3Provider
      let ethersSigner: providers.JsonRpcSigner
      if (apiKey) {
        ethersProvider = new providers.AlchemyWebSocketProvider(
          undefined,
          apiKey,
        )
        ethersSigner = new providers.Web3Provider(
          ethereum as providers.ExternalProvider,
        ).getSigner()
        setProvider(ethersProvider)
        setSigner(ethersSigner)
      } else {
        ethersProvider = new providers.Web3Provider(
          ethereum as providers.ExternalProvider,
        )
        ethersSigner = ethersProvider.getSigner()
        setProvider(ethersProvider)
        setSigner(ethersSigner)
      }
    } else {
      setSigner(null)
    }
  }, [ethereum, setSigner, setProvider])

  useEffect(() => {
    initialLoad()
  }, [initialLoad])

  useEffect(() => {
    setStoredWalletConnector(connector)
  }, [setStoredWalletConnector, connector])

  useEffect(() => {
    if (status === 'error') reset()
  }, [status, reset, error])

  return null
}

export { WalletConnector }
