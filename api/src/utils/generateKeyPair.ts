import crypto from 'crypto'

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

export function generateKeyPair(): crypto.KeyPairKeyObjectResult {
  return crypto.generateKeyPairSync(RSA, options)
}