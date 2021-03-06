import { passportConfig } from '../config/passport'
import { setupEnv } from './setupEnv'
import { setupExpressApp } from './setupExpressApp'
import { setupHTTP } from './setupHTTP'
import { setupGlobalIOServer } from './setupIOServer'
import { setupDB } from './setupMongo'

/**
 * Launches the app's initial setup phase  
 */
export default async function setup(): Promise<void> {
  setupEnv()
  await setupDB()
  passportConfig()
  const expressApp = setupExpressApp()
  const httpServer = setupHTTP(expressApp)
  setupGlobalIOServer(httpServer)
}