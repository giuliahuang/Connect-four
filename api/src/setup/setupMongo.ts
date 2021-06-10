import mongoose from 'mongoose'
import { exit } from 'process'
import logger from '../logger/'
import { getUserByEmail, newUser, setAdmin } from '../mongo/userMethods'

export async function setupDB(): Promise<typeof mongoose> {
  try {
    const db = await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    logger.info("Connected to MongoDB")
    const doc = await getUserByEmail("admin@connectfour.it")
    if (!doc) {
      logger.info("Creating admin user")
      const admin = await newUser('admin', 'admin@connectfour.it', 'admin')
      await setAdmin(admin.email)
    }
    return db
  } catch (err) {
    logger.error(`Error occurred during DB initialization: ${err}`)
  }

  logger.error(new Error('No db connection string found in process environment'))
  exit(1)
}
