import passport = require('passport')
import passportHTTP = require('passport-http')  // implements Basic and Digest authentication for HTTP (used for /login endpoint)
import jsonwebtoken = require('jsonwebtoken')  // JWT generation
import { userModel, } from '../models/User'
import { Logger } from 'tslog'

const logger = new Logger()

passport.use(new passportHTTP.BasicStrategy(
  function (username, password, done) {
    // "done" callback (verify callback) documentation:  http://www.passportjs.org/docs/configure/

    // Delegate function we provide to passport middleware
    // to verify user credentials

    logger.info(`New login attempt from ${username}`)
    userModel.findOne({ mail: username }, (err, user) => {
      if (err) {
        return done({ statusCode: 500, error: true, errormessage: err })
      }

      if (!user) {
        return done(null, false, {
          statusCode: 500,
          error: true,
          errormessage: 'Invalid user',
        })
      }

      if (user.validatePassword(password)) {
        return done(null, user)
      }

      return done(null, false, {
        statusCode: 500,
        error: true,
        errormessage: 'Invalid password',
      })
    })
  }
))

export const login = (passport.authenticate('basic', { session: false }), (req, res, next) => {
  // If we reach this point, the user is successfully authenticated and
  // has been injected into req.user

  // We now generate a JWT with the useful user data
  // and return it as response

  const tokendata = {
    username: req.user?.username,
    roles: req.user?.roles,
    mail: req.user?.mail,
    id: req.user?.id
  }

  logger.info("Login granted. Generating token")

  if (process.env.JWT_SECRET) {
    const token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '1h' })
    return res.status(200).json({ error: false, errormessage: "", token: token_signed })
  } else {
    logger.error('Couldn\'t find JWT secret')
    res.status(500).json({ error: true, errorMessage: 'An error occurred during JWT generation' })
  }
})
