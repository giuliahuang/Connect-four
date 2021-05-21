import { setupExpressApp } from './setupExpressApp'
import { setupHTTP } from './setupHTTP'
import { setupIOServer } from './setupIOServer'
import { SetupT } from './setupT'

export async function setup(): Promise<SetupT> {
  const expressApp = setupExpressApp()
  const httpServer = setupHTTP(expressApp)
  const ioServer = setupIOServer(httpServer)
  const result: SetupT = {
    httpServer,
    ioServer
  }

  return result
}