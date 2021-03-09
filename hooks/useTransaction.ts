import { BigNumber, ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState } from 'state/wallet'
import VanillaRouterABI from 'types/abis/vanillaRouter'
import { Action, TransactionDetails } from 'types/trade'
import { useWallet } from 'use-wallet'
import useAllTransactions from './useAllTransactions'
import useVanillaRouter from './useVanillaRouter'

function useTransaction(id: string): TransactionDetails | null {
  const { getTransaction, updateTransaction } = useAllTransactions()
  const [
    transactionDetails,
    setTransactionDetails,
  ] = useState<TransactionDetails | null>(null)
  const router = useVanillaRouter()
  const provider = useRecoilValue(providerState)
  const { account } = useWallet()

  /* const filteredPurchases = router?.filters.TokensPurchased(account, null) */

  useEffect(() => {
    if (router && account && provider) {
      const routerInterface = new ethers.utils.Interface(VanillaRouterABI)

      const purchaseTopic = ethers.utils.id(
        'TokensPurchased(address,address,uint256,uint256,uint256)',
      )
      const saleTopic = ethers.utils.id(
        'TokensSold(address,address,uint256,uint256,uint256,uint256,uint256)',
      )

      const preliminaryTransactionDetails = getTransaction(id)

      provider.waitForTransaction(id).then((receipt) => {
        const purchase = receipt.logs.find((log) => {
          if (log.topics.find((logTopic) => logTopic === purchaseTopic)) {
            return true
          } else {
            return false
          }
        })

        const sale = receipt.logs.find((log) => {
          if (log.topics.find((logTopic) => logTopic === saleTopic)) {
            return true
          } else {
            return false
          }
        })

        if (purchase || sale) {
          const data = purchase?.data || sale?.data || ''

          const {
            amount,
            eth,
          }: ethers.utils.Result = routerInterface.decodeEventLog(
            purchase ? 'TokensPurchased' : 'TokensSold',
            data,
          )

          let amountPaid = '0'
          let amountReceived = '0'
          if ((amount as BigNumber) && (eth as BigNumber)) {
            if (purchase) {
              amountPaid = eth.toString()
              amountReceived = amount.toString()
            } else {
              amountPaid = amount.toString()
              amountReceived = eth.toString()
            }
          }

          const newDetails = {
            action: purchase ? Action.PURCHASE : Action.SALE,
            received: preliminaryTransactionDetails?.received,
            paid: preliminaryTransactionDetails?.paid,
            amountReceived: amountReceived,
            amountPaid: amountPaid,
            hash: id,
            blockNumber: receipt.blockNumber,
            from: account,
          }

          setTransactionDetails(newDetails)

          const newTransactionDetails: TransactionDetails = preliminaryTransactionDetails
            ? {
                ...preliminaryTransactionDetails,
                receipt: receipt,
                amountPaid: amountPaid,
                amountReceived: amountReceived,
              }
            : {
                hash: id,
                action: purchase ? Action.PURCHASE : Action.SALE,
                from: receipt.from,
                receipt: receipt,
                amountPaid: amountPaid,
                amountReceived: amountReceived,
              }

          updateTransaction(id, newTransactionDetails)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, id])

  return transactionDetails
}

export default useTransaction
