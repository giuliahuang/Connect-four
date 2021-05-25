import jwt from 'jsonwebtoken'
import fs from 'fs'

const PRIV_KEY = fs.readFileSync('/workspace/api/src/config/id_rsa_priv.pem', 'utf8')
export function issueJWT(user) {
  const _id = user._id
  const expiresIn = '1d'
  const payload = {
    sub: _id,
    iat: Date.now(),
  }
  const signedToken = jwt.sign(payload, { key: PRIV_KEY, passphrase: 'secret' }, { expiresIn: expiresIn, algorithm: 'RS256' })
  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn
  }
}