import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { TransactionDetails } from 'types/trade'
import { useWallet } from 'use-wallet'
import { getTransactionKey } from 'utils/transactions'
import useAllTransactions from './useAllTransactions'
import useVanillaRouter from './useVanillaRouter'

interface PurchaseEvent {
  sender: string
  token: string
  sold: BigNumber
  bought: BigNumber
  newReserve: BigNumber
}

function useTransaction(id: string): TransactionDetails | null {
  const { getTransaction } = useAllTransactions()
  const [
    transactionDetails,
    setTransactionDetails,
  ] = useState<TransactionDetails | null>(null)
  const router = useVanillaRouter()
  const { account } = useWallet()

  const purchaseListener = (purchaseEvent: PurchaseEvent) => {
    const { token, sold, bought, newReserve } = purchaseEvent

    const tokenAddr = token
    const soldBN = sold && sold.toString && sold.toString()
    const boughtBN = bought && bought.toString && bought.toString()
    const newReserveBN =
      newReserve && newReserve.toString && newReserve.toString()

    console.log(tokenAddr, soldBN, boughtBN, newReserveBN)
  }

  const mineListener = async (transaction: any) => {
    console.log(transaction)
  }

  useEffect(() => {
    if (router && account) {
      setTransactionDetails(getTransaction(getTransactionKey(id, account)))

      // TODO: Check that this works.
      //router.once(id, mineListener)
      router.once('TokensPurchased', purchaseListener)
    }
    return () => {
      //router?.removeListener(id, mineListener)
      router?.removeListener('TokensPurchased', purchaseListener)
    }
  }, [router, id, getTransaction, account])

  return transactionDetails
}

export default useTransaction
