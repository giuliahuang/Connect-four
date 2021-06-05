import redis from 'redis'

const client = redis.createClient({
  host: 'localhost',
  port: 5000,
  password: 'memes'
})