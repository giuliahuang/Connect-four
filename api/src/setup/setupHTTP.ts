import { ExpressServer } from '../server/ExpressServer'
import http from 'http'
import logger from '../logger/'

/**
 * Creates a new HTTP server and binds it to the express app
 * @param expressApp 
 * @returns http.Server
 */
export function setupHTTP(expressApp: ExpressServer): http.Server {
  logger.info('Bootstrapping Express server')
  const httpServer = http.createServer(expressApp.app)
  return httpServer.listen(process.env.SERVER_PORT, () => {
    logger.info(`HTTP server listening on ${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}`)
  })
}