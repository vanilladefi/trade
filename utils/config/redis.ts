import { runsOnDocker } from './'

export const redisPort: string =
  process.env.REDIS_PORT && process.env.REDIS_PORT !== ''
    ? process.env.REDIS_PORT
    : '6379'

export const redisProtocolPrefix =
  process.env.REDIS_SECURE === 'true' ? 'rediss://' : 'redis://'

export const redisOptions =
  process.env.NODE_ENV !== 'development'
    ? {
        password: process.env.REDIS_PASSWORD,
      }
    : {}

const localRedisUrl: string = runsOnDocker ? `redis` : `localhost`

export const redisUrl = `${redisProtocolPrefix}${
  process.env.REDIS_URL && process.env.REDIS_URL !== ''
    ? process.env.REDIS_URL
    : localRedisUrl
}:${redisPort}`
