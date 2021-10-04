/* eslint-disable prefer-const */
import { providers } from 'ethers'
import { useEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { signerState, storedWalletConnectorState } from 'state/wallet'
import { Connectors, useWallet, Wallet } from 'use-wallet'
import { network } from 'utils/config'

type JsonRpcWallet = Wallet<providers.JsonRpcProvider>

const WalletConnector = (): ((
  connector?: keyof Connectors,
) => Promise<void>) => {
  const {
    status,
    error,
    connect,
    reset,
    type: walletType,
    ethereum,
  } = useWallet<JsonRpcWallet>()

  const [storedWalletConnector, setStoredWalletConnector] = useRecoilState(
    storedWalletConnectorState,
  )
  const setSigner = useSetRecoilState(signerState)

  const connectWallet = async (connector?: keyof Connectors) => {
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
  }

  useEffect(() => {
    if (ethereum) {
      const ethersSigner = new providers.Web3Provider(
        ethereum as providers.ExternalProvider,
        network,
      ).getSigner()
      console.log('EBIN?')
      setSigner(ethersSigner)
    } else {
      setSigner(null)
    }
  }, [ethereum, setSigner])

  useEffect(() => {
    if (status === 'error') reset()
  }, [status, reset, error])

  return connectWallet
}

export default WalletConnector
