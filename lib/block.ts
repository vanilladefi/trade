import { getTheGraphClient, MetaQuery, UniswapVersion } from 'lib/graphql'
import type { MetaQueryResponse } from 'types/trade'

export async function getCurrentBlockNumber(
  version: UniswapVersion,
): Promise<number> {
  try {
    const { http } = getTheGraphClient(version)
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
