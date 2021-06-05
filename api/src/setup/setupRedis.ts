import redis from 'redis'

export const client = redis.createClient({
  host: 'redis',
  port: 6379
})