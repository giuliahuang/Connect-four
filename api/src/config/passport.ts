import passport from 'passport'
import { ExtractJwt, Strategy as JWTStrategy, VerifiedCallback } from 'passport-jwt'
import logger from '../logger'
import { getUserById } from '../mongo/userMethods'
import Payload from './Payload'

/**
 * Sets up the passport middleware for authentication through JWT
 */
export function passportConfig(): void {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    algorithms: ['HS256']
  }
  const strategy = new JWTStrategy(options, jwtCallback)
  passport.use(strategy)
}

export async function jwtCallback(payload: Payload, done: VerifiedCallback): Promise<void> {
  try {
    const user = await getUserById(payload.sub)
    if (!user) return done(null, false, 'Not authorized')
    return done(null, user)
  } catch (err) {
    logger.prettyError(err)
    return done(err)
  }
}