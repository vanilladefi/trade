import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { transactionsState } from 'state/transactions'
import { ChainId, ChainIdToTransactionMapping } from 'types/general'
import { TransactionDetails, TransactionReceipt } from 'types/trade'
import { chainId } from 'utils/config'
import useVanillaRouter from './useVanillaRouter'

function useAllTransactions(): {
  transactions: Record<string, TransactionDetails>
  addTransaction: (transaction: TransactionReceipt) => void
  getTransaction: (transactionHash: string) => TransactionDetails | null
} {
  const [transactions, setTransactions] = useRecoilState(transactionsState)
  const castChainId = chainId.toString() as ChainId
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

  const transactionAdder = (transaction: TransactionReceipt) =>
    setTransactions((currentTransactions: ChainIdToTransactionMapping) => {
      const newTransactions: ChainIdToTransactionMapping = {
        ...currentTransactions,
      }
      newTransactions[castChainId][transaction.hash] = {
        from: transaction.from,
        hash: transaction.hash,
        addedTime: transaction.blockNumber || 0,
      }
      return { ...newTransactions }
    })

  const transactionGetter = (transactionHash: string) =>
    transactions[castChainId][transactionHash] || null

  return {
    transactions: transactions[castChainId],
    addTransaction: transactionAdder,
    getTransaction: transactionGetter,
  }
}

export default useAllTransactions
