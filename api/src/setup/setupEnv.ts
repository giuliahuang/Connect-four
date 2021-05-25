import dotenv from 'dotenv'
import { exit } from 'process'
import logger from '../logger/'

export function setupEnv() {
  if (dotenv.config().error) {
    logger.error('No .env file detected. Make sure it\'s located in api/')
    exit(1)
  }
}