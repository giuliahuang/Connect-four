import RSA from '../config/RSA'
import logger from '../logger'
import { generateKeyPair } from '../utils/generateKeyPair'

export function setupRSA(): RSA {
  logger.info('Generating RSA keys')
  const keys = generateKeyPair()

  return {
    PUB_KEY: keys.publicKey.toString(),
    PRIV_KEY: keys.privateKey.toString()
  }
}