import mongoose = require('mongoose')
import * as user from '../mongo/User'
import { Logger } from 'tslog'

const logger = new Logger()

export async function setupDB() {
  // Connect to mongodb and launch the HTTP server trough Express
  try {
    mongoose.set('useNewUrlParser', true)
    mongoose.set('useFindAndModify', false)
    mongoose.set('useCreateIndex', true)
    mongoose.set('useUnifiedTopology', true)
    const db = await mongoose.connect('mongodb://localhost:27017/connectfourdb')
    logger.info("Connected to MongoDB")
    const doc = await user.getModel().findOne({ mail: "admin@postmessages.it" })
    if (!doc) {
      logger.info("Creating admin user")

      var u = user.newUser({
        username: "admin",
        mail: "admin@connectfour.it"
      })
      u.setAdmin()
      u.setModerator()
      u.setPassword("admin")
      u.save()
    } else {
      logger.info("Admin user already exists")
    }
    return db
  } catch (err) {
    logger.error(`Error Occurred during initialization: ${err}`)
  }
}
