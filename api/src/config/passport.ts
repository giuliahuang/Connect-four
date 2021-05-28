import passport from 'passport'
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'
import logger from '../logger'
import { getUserById } from '../mongo/user'
import { RSA_KEYS } from '../setup/setup'
import { Payload } from '../utils/issueJWT'

export async function passportConfig() {
  const key = RSA_KEYS.PUB_KEY
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: key,
    algorithms: ['RS256']
  }
  const strategy = new JWTStrategy(options, jwtCallback)
  passport.use(strategy)
}

export async function jwtCallback(payload: Payload, done) {
  try {
    const user = await getUserById(payload.sub)
    if (user) return done(null, user)
    else return done(null, false)
  } catch (err) {
    logger.error(err)
    done(err)
  }
}