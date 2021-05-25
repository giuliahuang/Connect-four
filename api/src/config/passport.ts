import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'
import logger from '../logger'
import { UserModel } from '../models/User'
import fs from 'fs'
import passport from 'passport'

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: fs.readFileSync('/workspace/api/src/config/id_rsa_pub.pem'),
  algorithms: ['RS256']
}

async function callback(payload, done) {
  try {
    logger.info(payload)
    const user = await UserModel.findOne({ _id: payload.sub })
    logger.info(user)
    if (user) return done(null, user)
    else return done(null, false)
  } catch (err) {
    logger.error(err)
    done(err)
  }
}

const strategy = new JWTStrategy(options, callback)

passport.use(strategy)