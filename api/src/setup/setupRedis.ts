import { exit } from 'process'
import redis from 'redis'
import logger from '../logger'

let port: number
if (process.env.REDIS_PORT) port = parseInt(process.env.REDIS_PORT)
else {
  logger.error(new Error('Not Redis port number found in process environment'))
  exit(1)
}

export const redisClient = redis.createClient({
  host: 'redis',
  port: port
})

redisClient.on('connect', () => logger.info('Connected to Redis'))
redisClient.on("error", error => logger.prettyError(error))