import { useRecoilState } from 'recoil'
import { transactionsState } from 'state/transactions'
import { ChainId, ChainIdToTransactionMapping } from 'types/general'
import { TransactionDetails } from 'types/trade'
import { useWallet } from 'use-wallet'
import { chainId } from 'utils/config'
import { getTransactionKey } from 'utils/transactions'

function useAllTransactions(): {
  transactions: TransactionDetails[] | null
  transactionsByCurrentAccount: TransactionDetails[] | null
  addTransaction: (transaction: TransactionDetails) => void
  getTransaction: (transactionHash: string) => TransactionDetails | null
  updateTransaction: (
    transactionHash: string,
    transactionDetails: TransactionDetails,
  ) => void
} {
  const [transactions, setTransactions] = useRecoilState(transactionsState)
  const castChainId = chainId.toString() as ChainId
  const { account } = useWallet()

  const transactionAdder = (transaction: TransactionDetails) =>
    setTransactions((currentTransactions: ChainIdToTransactionMapping) => {
      const newTransactions: ChainIdToTransactionMapping = {
        ...currentTransactions,
      }
      if (account) {
        const transactionKey = getTransactionKey(transaction.hash, account)
        newTransactions[castChainId][transactionKey] = transaction
      }
      return { ...newTransactions }
    })

  const transactionGetter = (
    transactionHash: string,
  ): TransactionDetails | null => {
    if (account) {
      const transactionKey = getTransactionKey(transactionHash, account)
      return transactions[castChainId][transactionKey] || null
    } else {
      return null
    }
  }

  const transactionUpdater = (
    transactionHash: string,
    transactionDetails: TransactionDetails,
  ) => {
    setTransactions((currentTransactions: ChainIdToTransactionMapping) => {
      const newTransactions: ChainIdToTransactionMapping = {
        ...currentTransactions,
      }
      if (account) {
        const transactionKey = getTransactionKey(transactionHash, account)
        newTransactions[castChainId][transactionKey] = {
          ...transactionDetails,
        }
      }
      return { ...newTransactions }
    })
  }

  const allTransactions =
    transactions && account
      ? Object.keys(transactions[castChainId]).map((transactionKey) => {
          return transactions[castChainId][transactionKey]
        })
      : null

  const transactionsByAccount =
    transactions && account
      ? Object.keys(transactions[castChainId])
          .filter((transactionKey) => transactionKey.includes(account))
          .map((transactionKey) => {
            return transactions[castChainId][transactionKey]
          })
      : null

  return {
    transactions: allTransactions,
    transactionsByCurrentAccount: transactionsByAccount,
    addTransaction: transactionAdder,
    getTransaction: transactionGetter,
    updateTransaction: transactionUpdater,
  }
}

export default useAllTransactions
