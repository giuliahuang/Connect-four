import crypto from 'crypto'

interface HashAndSalt {
  salt: string,
  hash: string
}

export function genPassword(password: string): HashAndSalt {
  const salt = crypto.randomBytes(32).toString('hex')
  const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return {
    salt: salt,
    hash: genHash
  }
}

export function validatePassword(password: string, hash: string, salt: string): boolean {
  return hash === crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
}