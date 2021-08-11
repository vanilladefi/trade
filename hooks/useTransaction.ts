import { BigNumber, Contract, ethers } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { providerState } from 'state/wallet'
import VanillaV1Router01 from 'types/abis/VanillaV1Router01.json'
import { VanillaVersion } from 'types/general'
import { Action, TransactionDetails } from 'types/trade'
import { VanillaV1Router02__factory } from 'types/typechain/vanilla_v1.1/factories/VanillaV1Router02__factory'
import { VanillaV1Token02__factory } from 'types/typechain/vanilla_v1.1/factories/VanillaV1Token02__factory'
import { getVanillaRouterAddress, getVnlTokenAddress } from 'utils/config'
import useAllTransactions from './useAllTransactions'
import usePositionUpdater, { PositionUpdater } from './usePositionUpdater'

type TransactionHandlerProps = {
  transactionHash: string
  preliminaryTransactionDetails: TransactionDetails | null
  contract: Contract
  receipt: ethers.providers.TransactionReceipt
  setTransactionDetails: (newDetails: TransactionDetails) => void
  updateTransaction: (hash: string, newDetails: TransactionDetails) => void
  updatePosition?: PositionUpdater
}

type TransactionHandler = (arg0: TransactionHandlerProps) => void

const purchaseHandler = async ({
  transactionHash,
  preliminaryTransactionDetails,
  contract,
  receipt,
  setTransactionDetails,
  updateTransaction,
  updatePosition,
}: TransactionHandlerProps) => {
  let amountPaid = '0'
  let amountReceived = '0'

  if (contract?.filters?.TokensPurchased as ethers.EventFilter) {
    const purchaseFilter: ethers.EventFilter =
      contract.filters.TokensPurchased()
    const events: ethers.Event[] = await contract.queryFilter(
      purchaseFilter,
      receipt.blockNumber,
    )
    if (events.length > 0) {
      const { eth, amount } = events[0].args || { eth: '0', amount: '0' }
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
    receipt: receipt,
    pairId: preliminaryTransactionDetails?.pairId || '',
    logoColor: '',
  }

  setTransactionDetails(newDetails)

  const newTransactionDetails: TransactionDetails =
    preliminaryTransactionDetails
      ? {
          ...preliminaryTransactionDetails,
          ...newDetails,
        }
      : newDetails

  updateTransaction(newTransactionDetails.hash, newTransactionDetails)

  if (updatePosition && newDetails.received) {
    const delta = parseUnits(amountReceived, newDetails.received.decimals)
    updatePosition(newDetails.received, delta)
  }
}

const saleHandler = async ({
  transactionHash,
  preliminaryTransactionDetails,
  contract,
  receipt,
  setTransactionDetails,
  updateTransaction,
  updatePosition,
}: TransactionHandlerProps) => {
  let amountPaid = '0'
  let amountReceived = '0'
  let vnlReceived: string | undefined

  if (contract?.filters?.TokensSold as ethers.EventFilter) {
    const saleFilter: ethers.EventFilter = contract.filters.TokensSold()
    const events: ethers.Event[] = await contract.queryFilter(
      saleFilter,
      receipt.blockNumber,
    )
    if (events.length > 0) {
      const { eth, amount } = events[0].args || { eth: '0', amount: '0' }
      amountPaid = amount.toString()
      amountReceived = eth.toString()
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
    receipt: receipt,
    pairId: preliminaryTransactionDetails?.pairId || '',
    logoColor: '',
  }

  setTransactionDetails(newDetails)

  const newTransactionDetails: TransactionDetails =
    preliminaryTransactionDetails
      ? {
          ...preliminaryTransactionDetails,
          ...newDetails,
        }
      : newDetails

  updateTransaction(newTransactionDetails.hash, newTransactionDetails)

  if (updatePosition && newDetails.paid) {
    const delta = BigNumber.from('0').sub(
      parseUnits(amountPaid, newDetails.paid.decimals),
    )
    updatePosition(newDetails.paid, delta)
  }
}

const conversionHandler = async ({
  transactionHash,
  preliminaryTransactionDetails,
  contract,
  receipt,
  setTransactionDetails,
  updateTransaction,
}: TransactionHandlerProps) => {
  try {
    let amountConverted

    if (contract?.filters?.VNLConverted as ethers.EventFilter) {
      const conversionFilter: ethers.EventFilter =
        contract.filters.VNLConverted()
      const events: ethers.Event[] = await contract.queryFilter(
        conversionFilter,
        receipt.blockNumber,
      )
      console.log(events, receipt, conversionFilter)
      if (events.length > 0) {
        const { amount } = events[0].args || { amount: '0' }
        amountConverted = amount.toString()
      }
    }

    const newDetails = {
      action: Action.CONVERSION,
      amountConverted: amountConverted,
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
            ...newDetails,
          }
        : newDetails

    updateTransaction(newTransactionDetails.hash, newTransactionDetails)
  } catch (e) {
    console.error(e)
  }
}

const approvalHandler = async ({
  transactionHash,
  preliminaryTransactionDetails,
  contract,
  receipt,
  setTransactionDetails,
  updateTransaction,
}: TransactionHandlerProps) => {
  let amountApproved

  if (contract?.filters?.Approval as ethers.EventFilter) {
    const approvalFilter: ethers.EventFilter = contract.filters.Approval()
    const events: ethers.Event[] = await contract.queryFilter(
      approvalFilter,
      receipt.blockNumber,
    )
    if (events.length > 0) {
      const { amount } = events[0].args || { amount: '0' }
      amountApproved = amount.toString()
    }
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
          ...newDetails,
        }
      : newDetails

  updateTransaction(newTransactionDetails.hash, newTransactionDetails)
}

function useTransaction(
  version: VanillaVersion,
  id: string,
): TransactionDetails | null {
  const provider = useRecoilValue(providerState)
  const positionUpdater = usePositionUpdater(version)

  const { getTransaction, updateTransaction } = useAllTransactions()

  const [transactionDetails, setTransactionDetails] =
    useState<TransactionDetails | null>(null)

  const VanillaV1Token02 = VanillaV1Token02__factory.connect(
    getVnlTokenAddress(VanillaVersion.V1_1),
    provider,
  )

  useEffect(() => {
    const waitForConfirmation = async () => {
      if (provider) {
        const preliminaryTransactionDetails = getTransaction(id)
        const VanillaV1Router02 = VanillaV1Router02__factory.connect(
          getVanillaRouterAddress(VanillaVersion.V1_1),
          provider,
        )

        let handler: TransactionHandler
        let contract: Contract

        switch (preliminaryTransactionDetails?.action) {
          case Action.PURCHASE: {
            handler = purchaseHandler
            contract =
              version === VanillaVersion.V1_0
                ? new ethers.Contract(
                    getVanillaRouterAddress(version),
                    VanillaV1Router01.abi,
                    provider,
                  )
                : VanillaV1Router02
            break
          }
          case Action.SALE:
            handler = saleHandler
            contract =
              version === VanillaVersion.V1_0
                ? new ethers.Contract(
                    getVanillaRouterAddress(version),
                    VanillaV1Router01.abi,
                    provider,
                  )
                : VanillaV1Router02
            break
          case Action.CONVERSION:
            handler = conversionHandler
            contract = VanillaV1Token02
            break
          case Action.APPROVAL:
            handler = approvalHandler
            contract = VanillaV1Token02
            break
          default:
            return
        }

        const receipt = await provider.waitForTransaction(id)

        handler({
          transactionHash: id,
          preliminaryTransactionDetails: preliminaryTransactionDetails,
          contract: contract,
          receipt: receipt,
          setTransactionDetails: setTransactionDetails,
          updateTransaction: updateTransaction,
          updatePosition: positionUpdater,
        })
      }
    }
    waitForConfirmation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, provider, version])

  return transactionDetails
}

export default useTransaction
