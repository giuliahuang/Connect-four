import { ExpressServer } from '../server/ExpressServer'
import http from 'http'
import logger from '../logger/'

export function setupHTTP(expressApp: ExpressServer): http.Server {
  logger.info('Bootstrapping Express server')
  const httpServer = http.createServer(expressApp.app)
  return httpServer.listen(process.env.SERVER_PORT || 5000, () => {
    logger.info(`HTTP server listening on ${process.env.SERVER_HOSTNAME || 'localhost'}:${process.env.SERVER_PORT || 5000}`)
  })
}