import { BigNumber, ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
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
          }: ethers.utils.Result = routerInterface.decodeEventLog(
            purchase ? 'TokensPurchased' : 'TokensSold',
            data,
          )

          let bnAmount: BigNumber
          if (amount as BigNumber) {
            bnAmount = amount
          } else {
            bnAmount = BigNumber.from('0')
          }

          const formattedAmount = purchase
            ? formatUnits(
                bnAmount,
                preliminaryTransactionDetails?.received?.decimals,
              )
            : formatUnits(
                bnAmount,
                preliminaryTransactionDetails?.paid?.decimals,
              )

          const newDetails = {
            action: purchase ? Action.PURCHASE : Action.SALE,
            received: preliminaryTransactionDetails?.received,
            paid: preliminaryTransactionDetails?.paid,
            amount: formattedAmount,
            hash: id,
            blockNumber: receipt.blockNumber,
            from: account,
          }

          setTransactionDetails(newDetails)

          const newTransactionDetails = preliminaryTransactionDetails
            ? {
                ...preliminaryTransactionDetails,
                receipt: receipt,
                amount: bnAmount.toString(),
              }
            : {
                hash: id,
                action: purchase ? Action.PURCHASE : Action.SALE,
                from: receipt.from,
                receipt: receipt,
                amount: bnAmount.toString(),
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
