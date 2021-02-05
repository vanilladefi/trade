import { useEffect } from 'react'
import { useSetRecoilState, useRecoilCallback } from 'recoil'
import { useWallet } from 'use-wallet'
import { storedWalletConnectorState } from 'state/wallet'

const WalletConnector = (): null => {
  const { status, connect, reset, type: walletType, connector } = useWallet()
  const setStoredWalletConnector = useSetRecoilState(storedWalletConnectorState)

  const intialLoad = useRecoilCallback(
    ({ snapshot }) => async () => {
      const stored = await snapshot.getPromise(storedWalletConnectorState)
      if (!walletType && status === 'disconnected' && stored) connect(stored)
    },
    [walletType, status, connect],
  )

  useEffect(() => {
    intialLoad()
  }, [intialLoad])

  useEffect(() => {
    setStoredWalletConnector(connector)
  }, [setStoredWalletConnector, connector])

  useEffect(() => {
    if (status === 'error') reset()
  }, [status, reset])

  return null
}

export { WalletConnector }
