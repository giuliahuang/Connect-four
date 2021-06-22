import mongoose from 'mongoose'
import { exit } from 'process'
import logger from '../logger/'
import { getUserByUsername, newUser, setAdmin } from '../mongo/userMethods'

/**
 * Creates and connects to the database
 * @returns the mongoose server instance
 */
export async function setupDB(): Promise<typeof mongoose> {
  try {
    const db = await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    logger.info("Connected to MongoDB")
    const doc = await getUserByUsername("admin")
    if (!doc) {
      logger.info("Creating admin user")
      const admin = await newUser('admin', 'admin@connectfour.it', 'admin')
      if (admin) await setAdmin(admin.email)
    }
    return db
  } catch (err) {
    logger.prettyError(new Error(`Error occurred during DB initialization: ${err}`))
  }
  logger.prettyError(new Error('An error occurred during DB initialization'))
  exit(1)
}
