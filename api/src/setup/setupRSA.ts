import logger from '../logger'
import { generateKeyPair } from '../utils/generateKeyPair'
import fs from 'fs'

export function setupRSA(): any {
  logger.info('Generating RSA keys')
  generateKeyPair()
  return {
    PUB_KEY: fs.readFileSync('/workspace/api/src/config/id_rsa_pub.pem', 'utf8'),
    PRIV_KEY: fs.readFileSync('/workspace/api/src/config/id_rsa_priv.pem', 'utf8')
  }
}