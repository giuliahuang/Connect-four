import dotenv from 'dotenv'
import { cleanEnv, str } from 'envalid'
import { exit } from 'process'
import logger from '../logger/'
import path from 'path'

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