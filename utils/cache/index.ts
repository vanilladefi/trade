import Redis from 'ioredis'
import { redisOptions, redisUrl } from 'utils/config/redis'

const defaultExpiry = process.env.NODE_ENV === 'development' ? 3600 : 300

export const redis = new Redis(redisUrl, redisOptions)

export const addToCache = async (
  key: string,
  value: string,
  expiryAfterSeconds?: number,
): Promise<void> => {
  await redis.set(key, value)
  await redis.expire(key, expiryAfterSeconds ?? defaultExpiry)
}

export const getFromCache = async (key: string): Promise<string | false> => {
  const value = await redis.get(key)
  return value !== '' && value
}
