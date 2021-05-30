import { setupExpressApp } from './setupExpressApp'
import { setupHTTP } from './setupHTTP'
import { setupIOServer } from './setupIOServer'
import { setupDB } from './setupMongo'
import { setupEnv } from './setupEnv'
import { passportConfig } from '../config/passport'

export async function setup() {
  setupEnv()
  await passportConfig()
  const expressApp = setupExpressApp()
  const httpServer = setupHTTP(expressApp)
  await setupIOServer(httpServer)
  await setupDB()
}