import { useEffect, useState } from 'react'
import { TransactionDetails } from 'types/trade'
import useAllTransactions from './useAllTransactions'
import useVanillaRouter from './useVanillaRouter'

function useTransaction(id: string): TransactionDetails | null {
  const [transactionDetails, setTransactionDetails] = useState(null)
  const { addTransaction } = useAllTransactions()
  const router = useVanillaRouter()

  const purchaseListener = (
    sender: string,
    token: string,
    sold: string,
    bought: string,
    newReserve: string,
  ) => {
    console.log('TokensPurchased-event: ', {
      sender,
      token,
      sold,
      bought,
      newReserve,
    })
  }

  useEffect(() => {
    if (router) {
      router.on('TokensPurchased', purchaseListener)
    }
    return () => {
      router?.removeListener('TokensPurchased', purchaseListener)
    }
  }, [router])

  return transactionDetails
}

export default useTransaction
