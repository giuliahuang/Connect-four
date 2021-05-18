import { ExpressServer } from '../server'
import { Middleware } from '../server/middleware'
import cors from 'cors'
import { urlencoded, json } from 'express'
import health from '../routes/health'
import { Route } from '../routes/Route'
import root from '../routes/root'

export function setupExpressApp(): ExpressServer {
  const middlewareList: Middleware[] = [
    urlencoded({ extended: false }),
    json(),
    cors()
  ]

  const routeList: Route[] = [
    {
      path: '/',
      router: root
    },
    {
      path: '/health',
      router: health
    }
  ]

  const expressApp = new ExpressServer(middlewareList, routeList)
  return expressApp
}