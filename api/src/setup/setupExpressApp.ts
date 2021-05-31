import { ExpressServer } from '../server/ExpressServer'
import { Middleware } from '../server/middleware'
import cors from 'cors'
import health from '../routes/health'
import { Route } from '../routes/Route'
import { requestLogger } from '../server/middleware/requestLogger'
import passport from 'passport'
import login from '../routes/login'
import signup from '../routes/signup'
import auth from '../routes/auth'
import ranking from '../routes/ranking'

/**
 * Creates a new instance of the Express server with the predefined route list and
 * middleware list
 * @returns ExpressServer
 */
export function setupExpressApp(): ExpressServer {
  const middlewareList: Middleware[] = [
    cors(),
    requestLogger,
    passport.initialize()
  ]

  const routeList: Route[] = [
    {
      path: '/health',
      router: health
    },
    {
      path: '/login',
      router: login
    },
    {
      path: '/signup',
      router: signup
    },
    {
      path: '/auth',
      router: auth
    },
    {
      path: '/ranking',
      router: ranking
    }
  ]

  const expressApp = new ExpressServer(middlewareList, routeList)
  return expressApp
}