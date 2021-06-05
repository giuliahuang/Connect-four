import redis from 'redis'
import logger from '../logger'

export const redisClient = redis.createClient({
  host: 'redis',
  port: parseInt(process.env.REDIS_PORT!)
})

redisClient.on('connect', () => logger.info('Connected to Redis'))
redisClient.on("error", error => logger.prettyError(error))