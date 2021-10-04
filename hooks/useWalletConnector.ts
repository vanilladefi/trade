/* eslint-disable prefer-const */
import { providers } from 'ethers'
import { useCallback, useEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { signerState, storedWalletConnectorState } from 'state/wallet'
import { Connectors, useWallet, Wallet } from 'use-wallet'
import { network } from 'utils/config'

type JsonRpcWallet = Wallet<providers.JsonRpcProvider>

const WalletConnector = (): ((connector?: keyof Connectors) => void) => {
  const {
    status,
    error,
    connect,
    connector: useWalletConnector,
    reset,
    type: walletType,
    ethereum,
  } = useWallet<JsonRpcWallet>()

  const [storedWalletConnector, setStoredWalletConnector] = useRecoilState(
    storedWalletConnectorState,
  )
  const setSigner = useSetRecoilState(signerState)

  const connectWallet = useCallback(
    (connector?: keyof Connectors) => {
      if (
        !connector &&
        !walletType &&
        status === 'disconnected' &&
        storedWalletConnector
      ) {
        connect(storedWalletConnector)
      } else {
        connect(connector)
        setStoredWalletConnector(connector)
      }
    },
    [
      connect,
      setStoredWalletConnector,
      status,
      storedWalletConnector,
      walletType,
    ],
  )

  useEffect(() => {
    if (ethereum) {
      const ethersSigner = new providers.Web3Provider(
        ethereum as providers.ExternalProvider,
        network,
      ).getSigner()
      setSigner(ethersSigner)
    } else {
      setSigner(null)
    }
  }, [ethereum, setSigner, status])

  useEffect(() => {
    setStoredWalletConnector(useWalletConnector)
  }, [setStoredWalletConnector, useWalletConnector])

  useEffect(() => {
    if (status === 'error') reset()
  }, [status, reset, error])

  return connectWallet
}

export default WalletConnector
