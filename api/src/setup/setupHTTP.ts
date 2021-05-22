import { ExpressServer } from '../server/ExpressServer'
import http from 'http'
import { Logger } from 'tslog'
import config from '../config'

const logger = new Logger()

export function setupHTTP(expressApp: ExpressServer): http.Server {
  logger.info('Bootstrapping Express server')
  const httpServer = http.createServer(expressApp.app)
  return httpServer.listen(config.server.port, () => {
    logger.info(`HTTP server listening on ${config.server.hostname}:${config.server.port}`)
  })
}