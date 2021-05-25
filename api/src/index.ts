import logger from './logger/'
import { setup } from "./setup/setup"

async function main() {
  logger.info('App start')
  await setup()
}

main()