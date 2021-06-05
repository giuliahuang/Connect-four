import logger from './logger/'
import setup from "./setup"

async function main() {
  logger.info('App start')
  await setup()
}

main()

// import redis from 'redis'
// try {
//   const client = redis.createClient({
//     host: 'redis://localhost',
//     port: 6379
//   })
// } catch (err) {
//   logger.prettyError(err)
// }