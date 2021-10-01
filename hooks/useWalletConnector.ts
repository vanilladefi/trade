/* eslint-disable prefer-const */
import { providers } from 'ethers'
import { useCallback, useEffect } from 'react'
import { useRecoilCallback, useSetRecoilState } from 'recoil'
import { signerState, storedWalletConnectorState } from 'state/wallet'
import { useWallet, Wallet } from 'use-wallet'
import { network } from 'utils/config'

type JsonRpcWallet = Wallet<providers.JsonRpcProvider>

const WalletConnector = (): (() => void) => {
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

  const connectWallet = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const stored = await snapshot.getPromise(storedWalletConnectorState)
        if (!walletType && status === 'disconnected' && stored) connect(stored)
      },
    [walletType, status, connect],
  )

  const callback = useCallback(() => {
    connectWallet()
  }, [connectWallet])

  useEffect(() => {
    connectWallet()
  }, [connectWallet])

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
  }, [ethereum, setSigner])

  useEffect(() => {
    setStoredWalletConnector(connector)
  }, [setStoredWalletConnector, connector])

  useEffect(() => {
    if (status === 'error') reset()
  }, [status, reset, error])

  return callback
}

export default WalletConnector
