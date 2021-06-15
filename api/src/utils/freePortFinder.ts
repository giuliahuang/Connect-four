import portFinder from 'portfinder'
import logger from '../logger'

/**
 * @returns a port not currently in use between the range 8000-65535 or void in case of errors
 */
export default async function freePortFinder(): Promise<number | void> {
  try {
    const port = await portFinder.getPortPromise()
    return port
  } catch (err) {
    logger.error(err)
  }
}