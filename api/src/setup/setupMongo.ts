import mongoose = require('mongoose')
import { exit } from 'process'
import logger from '../logger/'
import { getUserByEmail, newUser, setAdmin } from '../mongo/userMethods'

export async function setupDB() {
  // Connect to mongodb and launch the HTTP server trough Express
  if (process.env.DB_CONNECTION_STRING) {
    try {
      const db = await mongoose.connect(process.env.DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
      })
      logger.info("Connected to MongoDB")
      const doc = await getUserByEmail("admin@connectfour.it")
      if (!doc) {
        logger.info("Creating admin user")
        const admin = await newUser('admin', 'admin@connectfour.it', 'admin')
        await setAdmin(admin)
      }
      return db
    } catch (err) {
      logger.error(`Error Occurred during initialization: ${err}`)
      exit(1)
    }
  }
}
