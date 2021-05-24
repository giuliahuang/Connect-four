import { setupExpressApp } from './setupExpressApp'
import { setupHTTP } from './setupHTTP'
import { setupIOServer } from './setupIOServer'
import { SetupT } from './setupT'
import { setupDB } from './setupMongo'
import dotenv from 'dotenv'

export async function setup(): Promise<SetupT> {
  dotenv.config({ path: '/workspace/api/src/setup/.env' })
  const expressApp = setupExpressApp()
  const httpServer = setupHTTP(expressApp)
  const ioServer = setupIOServer(httpServer)
  const mongoServer = await setupDB()
  const result: SetupT = {
    httpServer,
    ioServer,
    mongoServer
  }
  return result
}