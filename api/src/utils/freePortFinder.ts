import portFinder from 'portfinder'
import logger from '../logger'

/**
 * The specified port range has been set so that Docker doesn't take an eternity and then
 * some to start and create all the proxies. In a real world application the range would be
 * a lot higher.
 * @returns a port not currently in use between the range 8000-8100 or void in case of errors
 */
export default async function freePortFinder(): Promise<number | void> {
  try {
    const port = await portFinder.getPortPromise({
      port: 8000,
      stopPort: 8100
    })
    return port
  } catch (err) {
    logger.error(err)
  }
}