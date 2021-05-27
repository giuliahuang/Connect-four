import { ExpressServer } from '../server'
import { Middleware } from '../server/middleware'
import cors from 'cors'
import health from '../routes/health'
import { Route } from '../routes/Route'
import root from '../routes/root'
import { requestLogger } from '../server/middleware/requestLogger'
import passport from 'passport'
import login from '../routes/login'
import signup from '../routes/signup'
import auth from '../routes/auth'
import ws from '../routes/ws'

export function setupExpressApp(): ExpressServer {
  const middlewareList: Middleware[] = [
    cors(),
    requestLogger,
    passport.initialize()
  ]

  const routeList: Route[] = [
    {
      path: '/',
      router: root
    },
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
      path: '/ws',
      router: ws
    }
  ]

  const expressApp = new ExpressServer(middlewareList, routeList)
  return expressApp
}