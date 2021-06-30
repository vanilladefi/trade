import { BigNumber, ethers } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState } from 'state/wallet'
import VanillaV1Router01 from 'types/abis/VanillaV1Router01.json'
import VanillaV1Token02 from 'types/abis/VanillaV1Token02.json'
import { VanillaVersion } from 'types/general'
import { Action, TransactionDetails } from 'types/trade'
import { VanillaV1Router02__factory } from 'types/typechain/vanilla_v1.1'
import { getVanillaRouterAddress } from 'utils/config'
import useAllTransactions from './useAllTransactions'

type TransactionHandlerProps = {
  transactionHash: string
  preliminaryTransactionDetails: TransactionDetails | null
  contractInterface: Interface
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
  contractInterface,
  receipt,
  setTransactionDetails,
  updateTransaction,
}: TransactionHandlerProps) => {
  const eventName = 'TokensPurchased'
  const eventFragment = contractInterface.getEvent(eventName)
  const topicString = contractInterface.getEventTopic(eventFragment)
  const purchaseTopic = constructTopic(topicString)

  const purchase = findTopic(receipt, purchaseTopic)
  const data = purchase?.data || ''

  let amountPaid = '0'
  let amountReceived = '0'

  if (data !== '') {
    const { amount, eth }: ethers.utils.Result =
      contractInterface.decodeEventLog(eventFragment, data)
    if ((amount as BigNumber) && (eth as BigNumber)) {
      amountPaid = eth.toString()
      amountReceived = amount.toString()
    }
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

  const newTransactionDetails: TransactionDetails =
    preliminaryTransactionDetails
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
  contractInterface,
  receipt,
  setTransactionDetails,
  updateTransaction,
}: TransactionHandlerProps) => {
  const eventName = 'TokensSold'
  const eventFragment = contractInterface.getEvent(eventName)
  const topicString = contractInterface.getEventTopic(eventFragment)
  const saleTopic = constructTopic(topicString)

  const sale = findTopic(receipt, saleTopic)
  const data = sale?.data || ''

  let amountPaid = '0'
  let amountReceived = '0'
  let vnlReceived: string | undefined

  if (data !== '') {
    const { amount, eth, reward }: ethers.utils.Result =
      contractInterface.decodeEventLog(eventFragment, data)

    if ((amount as BigNumber) && (eth as BigNumber)) {
      amountPaid = amount.toString()
      amountReceived = eth.toString()
      vnlReceived = reward.toString()
    }
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

  const newTransactionDetails: TransactionDetails =
    preliminaryTransactionDetails
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
  contractInterface,
  receipt,
  setTransactionDetails,
  updateTransaction,
}: TransactionHandlerProps) => {
  try {
    const eventName = 'VNLConverted'
    const eventFragment = contractInterface.getEvent(eventName)
    const topicString = contractInterface.getEventTopic(eventFragment)
    const conversionTopic = constructTopic(topicString)

    const conversion = findTopic(receipt, conversionTopic)
    const data = conversion?.data || ''

    const { amount }: ethers.utils.Result = contractInterface.decodeEventLog(
      eventFragment,
      data,
    )

    let amountConverted
    if (amount as BigNumber) {
      amountConverted = amount.toString()
    }

    const newDetails = {
      action: Action.CONVERSION,
      amountConverted: amountConverted,
      hash: transactionHash,
      blockNumber: receipt.blockNumber,
      from: receipt.from,
    }

    setTransactionDetails(newDetails)

    const newTransactionDetails: TransactionDetails =
      preliminaryTransactionDetails
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
  } catch (e) {
    console.error(e)
  }
}

const approvalHandler = ({
  transactionHash,
  preliminaryTransactionDetails,
  contractInterface,
  receipt,
  setTransactionDetails,
  updateTransaction,
}: TransactionHandlerProps) => {
  const eventName = 'Approval'
  const eventFragment = contractInterface.getEvent(eventName)
  const topicString = contractInterface.getEventTopic(eventFragment)
  const topic = constructTopic(topicString)

  const approval = findTopic(receipt, topic)
  const data = approval?.data || ''

  const result: ethers.utils.Result | undefined =
    approval && contractInterface.decodeEventLog(eventFragment, data)

  let amountApproved
  if (result?.value as BigNumber) {
    amountApproved = result?.value.toString()
  }

  const newDetails = {
    action: Action.APPROVAL,
    amountApproved: amountApproved,
    hash: transactionHash,
    blockNumber: receipt.blockNumber,
    from: receipt.from,
    receipt: receipt,
  }

  setTransactionDetails(newDetails)

  const newTransactionDetails: TransactionDetails =
    preliminaryTransactionDetails
      ? {
          ...preliminaryTransactionDetails,
          receipt: receipt,
        }
      : {
          hash: newDetails.hash,
          action: Action.APPROVAL,
          amountApproved: amountApproved,
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
  const [transactionDetails, setTransactionDetails] =
    useState<TransactionDetails | null>(null)
  const provider = useRecoilValue(providerState)
  const VanillaV1Router02Interface = VanillaV1Router02__factory.connect(
    getVanillaRouterAddress(VanillaVersion.V1_1),
    provider,
  ).interface

  useEffect(() => {
    const waitForConfirmation = async () => {
      if (provider) {
        const preliminaryTransactionDetails = getTransaction(id)

        let handler: TransactionHandler
        let contractInterface: Interface
        switch (preliminaryTransactionDetails?.action) {
          case Action.PURCHASE: {
            handler = purchaseHandler
            contractInterface =
              version === VanillaVersion.V1_0
                ? new ethers.utils.Interface(VanillaV1Router01.abi)
                : VanillaV1Router02Interface
            break
          }
          case Action.SALE:
            handler = saleHandler
            contractInterface =
              version === VanillaVersion.V1_0
                ? new ethers.utils.Interface(VanillaV1Router01.abi)
                : VanillaV1Router02Interface
            break
          case Action.CONVERSION:
            handler = conversionHandler
            contractInterface = new ethers.utils.Interface(VanillaV1Token02.abi)
            break
          case Action.APPROVAL:
            handler = approvalHandler
            contractInterface = new ethers.utils.Interface(VanillaV1Token02.abi)
            break
          default:
            return
        }

        const receipt = await provider.waitForTransaction(id)

        handler({
          transactionHash: id,
          preliminaryTransactionDetails: preliminaryTransactionDetails,
          contractInterface: contractInterface,
          receipt: receipt,
          setTransactionDetails: setTransactionDetails,
          updateTransaction: updateTransaction,
        })
      }
    }
    waitForConfirmation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return transactionDetails
}

export default useTransaction
