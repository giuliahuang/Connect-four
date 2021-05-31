import { Request } from 'express'
import jwtDecode from 'jwt-decode'
import Payload from '../config/Payload'

/**
 * @param req HTTP request
 * @returns the JWT payload for authentication purposes
 */
export default function extractTokenPayload(req: Request): Payload | undefined {
  const authHeader = String(req.headers.authorization || '')
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7, authHeader.length)
    return jwtDecode(token)
  }
  return undefined
}