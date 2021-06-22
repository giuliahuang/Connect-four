import { exit } from 'process'
import redis from 'redis'
import logger from '../logger'

/**
 * Creates a singleton instance of the Redis client object
 */
export const redisClient = redis.createClient({
  host: 'redis',
  port: parseInt(process.env.REDIS_PORT),
  password: 'mypassword'
})

redisClient.on('connect', () => logger.info('Connected to Redis'))
redisClient.on("error", error => { logger.prettyError(error); exit(1) })