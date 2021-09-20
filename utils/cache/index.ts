import Redis from 'ioredis'

const protocolPrefix =
  process.env.NODE_ENV === 'development' ? 'redis://' : 'rediss://'

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
  await redis.expire(key, expiryAfterSeconds ?? 300)
}

export const getFromCache = async (key: string): Promise<string | false> => {
  const value = await redis.get(key)
  return value !== '' && value
}
