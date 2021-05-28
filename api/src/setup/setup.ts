import { setupExpressApp } from './setupExpressApp'
import { setupHTTP } from './setupHTTP'
import { setupIOServer } from './setupIOServer'
import { setupDB } from './setupMongo'
import { setupEnv } from './setupEnv'
import RSA from '../config/RSA'
import { setupRSA } from './setupRSA'
import { passportConfig } from '../config/passport'

export let RSA_KEYS: RSA

export async function setup() {
  setupEnv()
  RSA_KEYS = setupRSA()
  await passportConfig()
  const expressApp = setupExpressApp()
  const httpServer = setupHTTP(expressApp)
  await setupIOServer(httpServer)
  await setupDB()
}