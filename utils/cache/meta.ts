import { getCurrentBlockNumber } from 'lib/block'
import { getETHPrice } from 'lib/tokens'
import { getBasicWalletDetails } from 'lib/vanilla/users'
import { UniswapVersion, VanillaVersion } from 'types/general'
import { addToCache, getFromCache } from 'utils/cache'

export const getBlockNumber = async (): Promise<number> => {
  let currentBlockNumber: number
  const currentBlockNumberCacheKey = 'currentBlockNumber'
  const cachedBlockNumber = await getFromCache(currentBlockNumberCacheKey)
  if (cachedBlockNumber) {
    currentBlockNumber = Number(cachedBlockNumber)
  } else {
    currentBlockNumber = await getCurrentBlockNumber(UniswapVersion.v3)
    await addToCache(currentBlockNumberCacheKey, currentBlockNumber.toString())
  }
  return currentBlockNumber
}

export const getEthPrice = async (): Promise<number> => {
  let ethPrice: number
  const ethPriceCacheKey = 'ethPrice'
  const cachedEthPrice = await getFromCache(ethPriceCacheKey)
  if (cachedEthPrice) {
    ethPrice = Number(cachedEthPrice)
  } else {
    ethPrice = await getETHPrice(UniswapVersion.v3)
    await addToCache(ethPriceCacheKey, ethPrice.toString())
  }
  return ethPrice
}

export const getWalletBalances = async (
  walletAddress: string | false,
): Promise<{ vnlBalance: string; ethBalance: string }> => {
  let [vnlBalance, ethBalance] = ['0', '0']
  if (walletAddress) {
    const vnlBalanceCacheKey = `balance-vnl-${walletAddress}`
    const ethBalanceCacheKey = `balance-eth-${walletAddress}`
    const cachedVnlBalance = await getFromCache(vnlBalanceCacheKey)
    const cachedEthBalance = await getFromCache(ethBalanceCacheKey)
    if (cachedVnlBalance && cachedEthBalance) {
      vnlBalance = cachedVnlBalance
      ethBalance = cachedEthBalance
    } else {
      const response =
        (walletAddress &&
          (await getBasicWalletDetails(VanillaVersion.V1_1, walletAddress))) ||
        undefined
      vnlBalance = response.vnlBalance
      ethBalance = response.ethBalance
      await addToCache(vnlBalanceCacheKey, vnlBalance)
      await addToCache(ethBalanceCacheKey, ethBalance)
    }
  }
  return { vnlBalance, ethBalance }
}
