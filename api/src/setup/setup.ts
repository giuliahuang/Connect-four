import { setupExpressApp } from './setupExpressApp'
import { setupHTTP } from './setupHTTP'
import { setupIOServer } from './setupIOServer'
import { setupDB } from './setupMongo'
import { setupEnv } from './setupEnv'
require('../config/passport')

export async function setup() {
  setupEnv()
  const expressApp = setupExpressApp()
  const httpServer = setupHTTP(expressApp)
  setupIOServer(httpServer)
  await setupDB()
}