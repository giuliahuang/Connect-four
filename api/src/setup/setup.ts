import { setupExpressApp } from './setupExpressApp'
import { setupHTTP } from './setupHTTP'
import { SetupT } from './setupT'

export async function setup(): Promise<SetupT> {
  const expressApp = setupExpressApp()
  const httpServer = setupHTTP(expressApp)
  const result: SetupT = {
    httpServer,
  }

  return result
}