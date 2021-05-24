import { Logger } from "tslog"
import { setup } from "./setup/setup"

const logger = new Logger()

async function main() {
  logger.info('App start')
  await setup()
}

main()