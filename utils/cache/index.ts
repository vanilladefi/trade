import Redis from 'ioredis'

const defaultExpiry = process.env.NODE_ENV === 'development' ? 3600 : 300

const protocolPrefix =
  process.env.NODE_ENV === 'development' ||
  process.env.REDIS_INSECURE === 'true'
    ? 'redis://'
    : 'rediss://'

const redisOptions =
  process.env.NODE_ENV !== 'development'
    ? {
        password: process.env.REDIS_PASSWORD,
      }
    : {}

export const redis = new Redis(
  `${protocolPrefix}${process.env.REDIS_URL}`,
  redisOptions,
)

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
