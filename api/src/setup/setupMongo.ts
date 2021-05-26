import mongoose = require('mongoose')
import { exit } from 'process'
import logger from '../logger/'
import { newUser, getUserByEmail, setAdmin } from '../mongo/user'

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
