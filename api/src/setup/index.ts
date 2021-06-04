import { setupExpressApp } from './setupExpressApp'
import { setupHTTP } from './setupHTTP'
import { setupGlobalIOServer } from './setupIOServer'
import { setupDB } from './setupMongo'
import { setupEnv } from './setupEnv'
import { passportConfig } from '../config/passport'

/**
 * Launches the app's initial setup phase  
 */
export default async function setup() {
  setupEnv()
  passportConfig()
  const expressApp = setupExpressApp()
  const httpServer = setupHTTP(expressApp)
  setupGlobalIOServer(httpServer)
  await setupDB()
}