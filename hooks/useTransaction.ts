import { BigNumber, ethers } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState } from 'state/wallet'
import VanillaRouter from 'types/abis/vanillaRouter.json'
import { VanillaVersion } from 'types/general'
import { Action, TransactionDetails } from 'types/trade'
import useAllTransactions from './useAllTransactions'
import useVanillaRouter from './useVanillaRouter'

type TransactionHandlerProps = {
  transactionHash: string
  preliminaryTransactionDetails: TransactionDetails | null
  routerInterface: Interface
  receipt: ethers.providers.TransactionReceipt
  setTransactionDetails: (newDetails: TransactionDetails) => void
  updateTransaction: (hash: string, newDetails: TransactionDetails) => void
}

type TransactionHandler = (arg0: TransactionHandlerProps) => void

const findTopic = (
  receipt: ethers.providers.TransactionReceipt,
  topic: string,
) =>
  receipt.logs.find((log) => {
    if (log.topics.find((logTopic) => logTopic === topic)) {
      return true
    } else {
      return false
    }
  })

const constructTopic = (topic: string) => ethers.utils.id(topic)

const purchaseHandler = ({
  transactionHash,
  preliminaryTransactionDetails,
  routerInterface,
  receipt,
  setTransactionDetails,
  updateTransaction,
}: TransactionHandlerProps) => {
  const eventFragment = 'TokensPurchased'
  const topicString = 'TokensPurchased(address,address,uint256,uint256,uint256)'
  const purchaseTopic = constructTopic(topicString)

  const purchase = findTopic(receipt, purchaseTopic)
  const data = purchase?.data || ''

  const { amount, eth }: ethers.utils.Result = routerInterface.decodeEventLog(
    eventFragment,
    data,
  )

  let amountPaid = '0'
  let amountReceived = '0'
  if ((amount as BigNumber) && (eth as BigNumber)) {
    amountPaid = eth.toString()
    amountReceived = amount.toString()
  }

  const newDetails = {
    action: Action.PURCHASE,
    received: preliminaryTransactionDetails?.received,
    paid: preliminaryTransactionDetails?.paid,
    amountReceived: amountReceived,
    amountPaid: amountPaid,
    hash: transactionHash,
    blockNumber: receipt.blockNumber,
    from: receipt.from,
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
        hash: newDetails.hash,
        action: purchase ? Action.PURCHASE : Action.SALE,
        from: receipt.from,
        receipt: receipt,
        amountPaid: amountPaid,
        amountReceived: amountReceived,
      }

  updateTransaction(newTransactionDetails.hash, newTransactionDetails)
}

const saleHandler = ({
  transactionHash,
  preliminaryTransactionDetails,
  routerInterface,
  receipt,
  setTransactionDetails,
  updateTransaction,
}: TransactionHandlerProps) => {
  const eventFragment = 'TokensSold'
  const topicString =
    'TokensSold(address,address,uint256,uint256,uint256,uint256,uint256)'
  const saleTopic = constructTopic(topicString)

  const sale = findTopic(receipt, saleTopic)
  const data = sale?.data || ''

  const {
    amount,
    eth,
    reward,
  }: ethers.utils.Result = routerInterface.decodeEventLog(eventFragment, data)

  let amountPaid = '0'
  let amountReceived = '0'
  let vnlReceived: string | undefined
  if ((amount as BigNumber) && (eth as BigNumber)) {
    amountPaid = amount.toString()
    amountReceived = eth.toString()
    vnlReceived = reward.toString()
  }

  const newDetails = {
    action: Action.SALE,
    received: preliminaryTransactionDetails?.received,
    paid: preliminaryTransactionDetails?.paid,
    amountReceived: amountReceived,
    amountPaid: amountPaid,
    hash: transactionHash,
    blockNumber: receipt.blockNumber,
    from: receipt.from,
    reward: vnlReceived,
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
        hash: newDetails.hash,
        action: Action.SALE,
        from: receipt.from,
        receipt: receipt,
        amountPaid: amountPaid,
        amountReceived: amountReceived,
      }

  updateTransaction(newTransactionDetails.hash, newTransactionDetails)
}

const conversionHandler = ({
  transactionHash,
  preliminaryTransactionDetails,
  routerInterface,
  receipt,
  setTransactionDetails,
  updateTransaction,
}: TransactionHandlerProps) => {
  const eventFragment = 'VNLConverted'
  const topicString = 'VNLConverted(address,uint256)'
  const conversionTopic = constructTopic(topicString)

  const conversion = findTopic(receipt, conversionTopic)
  const data = conversion?.data || ''

  const {
    convertedAmount,
  }: ethers.utils.Result = routerInterface.decodeEventLog(eventFragment, data)

  let amountConverted
  if (convertedAmount as BigNumber) {
    amountConverted = convertedAmount.toString()
  }

  const newDetails = {
    action: Action.CONVERSION,
    amountConverted: amountConverted,
    hash: transactionHash,
    blockNumber: receipt.blockNumber,
    from: receipt.from,
  }

  setTransactionDetails(newDetails)

  const newTransactionDetails: TransactionDetails = preliminaryTransactionDetails
    ? {
        ...preliminaryTransactionDetails,
        receipt: receipt,
      }
    : {
        hash: newDetails.hash,
        action: Action.CONVERSION,
        from: receipt.from,
        receipt: receipt,
      }

  updateTransaction(newTransactionDetails.hash, newTransactionDetails)
}

const approvalHandler = ({
  transactionHash,
  preliminaryTransactionDetails,
  routerInterface,
  receipt,
  setTransactionDetails,
  updateTransaction,
}: TransactionHandlerProps) => {
  const eventFragment = 'Approval'
  const topicString = 'Approval(address,address,uint256)'
  const topic = constructTopic(topicString)

  const approval = findTopic(receipt, topic)
  const data = approval?.data || ''

  const { amount }: ethers.utils.Result = routerInterface.decodeEventLog(
    eventFragment,
    data,
  )

  let amountApproved
  if (amount as BigNumber) {
    amountApproved = amount.toString()
  }

  const newDetails = {
    action: Action.APPROVAL,
    amountApproved: amountApproved,
    hash: transactionHash,
    blockNumber: receipt.blockNumber,
    from: receipt.from,
  }

  setTransactionDetails(newDetails)

  const newTransactionDetails: TransactionDetails = preliminaryTransactionDetails
    ? {
        ...preliminaryTransactionDetails,
        receipt: receipt,
      }
    : {
        hash: newDetails.hash,
        action: Action.APPROVAL,
        from: receipt.from,
        receipt: receipt,
      }

  updateTransaction(newTransactionDetails.hash, newTransactionDetails)
}

function useTransaction(
  version: VanillaVersion,
  id: string,
): TransactionDetails | null {
  const { getTransaction, updateTransaction } = useAllTransactions()
  const [
    transactionDetails,
    setTransactionDetails,
  ] = useState<TransactionDetails | null>(null)
  const router = useVanillaRouter(version)
  const provider = useRecoilValue(providerState)

  useEffect(() => {
    if (router && provider) {
      const routerInterface = new ethers.utils.Interface(VanillaRouter.abi)
      const preliminaryTransactionDetails = getTransaction(id)

      let handler: TransactionHandler
      switch (transactionDetails?.action) {
        case Action.PURCHASE:
          handler = purchaseHandler
          break
        case Action.SALE:
          handler = saleHandler
          break
        case Action.CONVERSION:
          handler = conversionHandler
          break
        case Action.APPROVAL:
          handler = approvalHandler
          break
        default:
          return
      }

      provider.waitForTransaction(id).then((receipt) => {
        handler({
          transactionHash: id,
          preliminaryTransactionDetails: preliminaryTransactionDetails,
          routerInterface: routerInterface,
          receipt: receipt,
          setTransactionDetails: setTransactionDetails,
          updateTransaction: updateTransaction,
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return transactionDetails
}

export default useTransaction
