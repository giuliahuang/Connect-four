import crypto from 'crypto'

interface HashAndSalt {
  salt: string,
  hash: string
}

/**
 * Creates a new password from the provided string
 * @param password Plain text password provided by the user
 * @returns an object containing the newly generated salt and hash
 */
export function genPassword(password: string): HashAndSalt {
  const salt = crypto.randomBytes(32).toString('hex')
  const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return {
    salt: salt,
    hash: genHash
  }
}

/**
 * Validates the password against the hash and salt
 * @param password Plain text password
 * @param hash 
 * @param salt 
 * @returns 
 */
export function validatePassword(password: string, hash: string, salt: string): boolean {
  return hash === crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
}