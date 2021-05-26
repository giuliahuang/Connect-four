import jwtDecode from 'jwt-decode'
import { Request } from 'express'
import { Payload } from './issueJWT'

export default function extractTokenPayload(req: Request): Payload | undefined {
  const authHeader = String(req.headers.authorization || '')
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7, authHeader.length)
    return jwtDecode(token)
  }
  return undefined
}