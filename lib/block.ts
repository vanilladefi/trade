import { getTheGraphClient, MetaQuery, UniswapVersion } from 'lib/graphql'
import type { MetaQueryResponse } from 'types/trade'

export async function getCurrentBlockNumber(): Promise<number> {
  try {
    const { http } = getTheGraphClient(UniswapVersion.v2)
    const response: MetaQueryResponse = await http.request(MetaQuery)
    return response._meta.block.number
  } catch (e) {
    console.error(e)
    return 0
  }
}

export async function getAverageBlockCountPerHour(): Promise<number> {
  const estimatedBlocktime = 15 // seconds
  return Math.floor(3600 / estimatedBlocktime)
}
