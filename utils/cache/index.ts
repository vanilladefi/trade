import Redis from 'ioredis'

export const redis = new Redis(`rediss://${process.env.REDIS_URL}`, {
  password: process.env.REDIS_PASSWORD,
})

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
