import { setupExpressApp } from './setupExpressApp'
import { setupHTTP } from './setupHTTP'
import { setupIOServer } from './setupIOServer'
import { SetupT } from './setupT'
import { setUpDB } from '../mongo/mongoDB'

export async function setup(): Promise<SetupT> {
  const expressApp = setupExpressApp()
  const httpServer = setupHTTP(expressApp)
  const ioServer = setupIOServer(httpServer)
  const result: SetupT = {
    httpServer,
    ioServer
  }
  const db =  setUpDB()

  return result
}