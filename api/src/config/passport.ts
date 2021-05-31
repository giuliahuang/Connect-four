import passport from 'passport'
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'
import logger from '../logger'
import UserModel from '../mongo/User'
import Payload from './Payload'

/**
 * Sets up the passport middleware for authentication through JWT
 */
export async function passportConfig() {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    algorithms: ['HS256']
  }
  const strategy = new JWTStrategy(options, jwtCallback)
  passport.use(strategy)
}

export async function jwtCallback(payload: Payload, done) {
  try {
    const user = await UserModel.findById(payload.sub)
    if (user) return done(null, user)
    else return done(null, false)
  } catch (err) {
    logger.error(err)
    done(err)
  }
}