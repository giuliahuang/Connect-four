import crypto from 'crypto'
import fs from 'fs'
import logger from '../logger'

const RSA = 'rsa'
const passphrase = 'secret'
const options = {
  modulusLength: 1024 * 2,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: passphrase
  }
}

function callback(err, publicKey, privateKey) {
  if (err) {
    logger.error(err)
  } else {
    fs.writeFileSync(`/workspace/api/src/config/id_rsa_pub.pem`, publicKey)
    fs.writeFileSync(`/workspace/api/src/config/id_rsa_priv.pem`, privateKey)
  }
}

export function generateKeyPair() {
  crypto.generateKeyPair(RSA, options, callback)
}