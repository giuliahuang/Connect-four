import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'
import logger from '../logger'
import { getUserById } from '../mongo/user'
import fs from 'fs'
import passport from 'passport'
import { Payload } from '../utils/issueJWT'

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: fs.readFileSync('/workspace/api/src/config/id_rsa_pub.pem'),
  algorithms: ['RS256']
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

const strategy = new JWTStrategy(options, jwtCallback)

passport.use(strategy)