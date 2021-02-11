import { thegraphClient, MetaQuery } from 'lib/graphql'
import type { MetaQueryResponse } from 'types/trade'

export async function getCurrentBlockNumber(): Promise<number> {
  try {
    const response: MetaQueryResponse = await thegraphClient.request(MetaQuery)
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
