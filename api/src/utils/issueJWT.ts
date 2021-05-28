import jwt from 'jsonwebtoken'
import { RSA_KEYS } from '../setup/setup'

export interface Payload {
  sub: string,
  iat: number
}

export async function issueJWT(user): Promise<any> {
  const _id = user._id
  const expiresIn = '30d'

  const payload: Payload = {
    sub: _id,
    iat: Date.now()
  }

  const PRIV_KEY = RSA_KEYS.PRIV_KEY
  const signedToken = jwt.sign(payload, { key: PRIV_KEY, passphrase: 'secret' }, { expiresIn: expiresIn, algorithm: 'RS256' })
  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn
  }
}