import passport from 'passport'
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'
import UserModel from '../mongo/User'
import Payload from './Payload'

/**
 * Sets up the passport middleware for authentication through JWT
 */
export function passportConfig() {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    algorithms: ['HS256']
  }
  const strategy = new JWTStrategy(options, jwtCallback)
  passport.use(strategy)
}

export async function jwtCallback(payload: Payload, done) {
  UserModel.findById((payload.sub), function (err, user) {
    if (err) {
      return done(err)
    }
    if (!user) {
      return done(null, false, 'Not authorized')
    }
    return done(null, user)
  })
}