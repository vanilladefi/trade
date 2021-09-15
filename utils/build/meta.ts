import { getCurrentBlockNumber } from 'lib/block'
import { getETHPrice } from 'lib/tokens'
import { UniswapVersion } from 'types/general'
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
