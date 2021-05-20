import Express from 'express'
import type { Middleware } from './middleware/Middleware'
import { Logger } from 'tslog'
import { Route } from '../routes/Route'
import { notFoundCatcher } from './middleware/notFoundCatcher'

const logger = new Logger()

export class ExpressServer {
  public app: Express.Express

  constructor(middlewareList: Middleware[], routeList: Route[]) {
    this.app = Express()

    logger.info('Setting up Express middleware')
    middlewareList.forEach(middleware => {
      this.app.use(middleware)
    })

    logger.info('Setting up Express routes')
    routeList.forEach(route => {
      this.app.use(route.path, route.router)
    })
    this.app.use(notFoundCatcher)
  }
}