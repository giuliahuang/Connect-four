import mongoose = require('mongoose')
import * as user from '../models/User'
import { Logger } from 'tslog'
import crypto from 'crypto'

const logger = new Logger()

export async function setupDB() {
  // Connect to mongodb and launch the HTTP server trough Express
  try {
    const db = await mongoose.connect('mongodb://localhost:27017/connectfourdb', {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
    logger.info("Connected to MongoDB")
    const doc = await user.userModel.findOne({ mail: "admin@postmessages.it" })
    if (!doc) {
      logger.info("Creating admin user")
      const salt = crypto.randomBytes(16).toString('hex')
      const hmac = crypto.createHmac('sha512', salt)
      const u = user.newUser({
        username: "admin",
        mail: "admin@connectfour.it",
        roles: ['ADMIN'],
        salt: salt,
        digest: hmac.digest('hex')
      })
    } else {
      logger.info("Admin user already exists")
    }
    return db
  } catch (err) {
    logger.error(`Error Occurred during initialization: ${err}`)
  }
}
