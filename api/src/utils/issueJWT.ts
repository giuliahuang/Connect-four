import jwt from 'jsonwebtoken'
import { exit } from 'process'
import Payload from '../config/Payload'
import logger from '../logger'
import User from '../models/User'

interface JsonWebTokenResponse {
  token: string,
  expires: string
}

/**
 * Uses the provided user to generate and sign a new JWT
 * @param user who just registered or logged in
 * @returns either  an object containing the JWT and the expiration
 */
export async function issueJWT(user: User): Promise<JsonWebTokenResponse> {
  const expiresIn = '30d'

  const payload: Payload = {
    sub: user._id,
    iat: Date.now()
  }

  if (process.env.JWT_SECRET) {
    const signedToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresIn, algorithm: 'HS256' })
    return {
      token: `Bearer ${signedToken}`,
      expires: expiresIn
    }
  } else {
    logger.info('JWT secret not found in .env file')
    exit(1)
  }
}