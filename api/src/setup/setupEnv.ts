import dotenv from 'dotenv'
import { cleanEnv, str } from 'envalid'
import { exit } from 'process'
import logger from '../logger/'
import path from 'path'

/**
 * Loads the envinronment file into the process.env and checks
 * if all needed variables have been provided
 */
export function setupEnv(): void {
  if (dotenv.config({ path: path.join(__dirname, '../../.env') }).error) {
    logger.error('No .env file detected')
    exit(1)
  }
  cleanEnv(process.env, {
    SERVER_HOSTNAME: str(),
    SERVER_PORT: str(),
    REDIS_PORT: str(),
    JWT_SECRET: str(),
    MONGO_CONNECTION_STRING: str()
  })
}