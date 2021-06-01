import dotenv from 'dotenv'
import { exit } from 'process'
import logger from '../logger/'
import path from 'path'

export function setupEnv() {
  if (dotenv.config({ path: path.join(__dirname, '../../src/config/.env') }).error) {
    logger.error('No .env file detected. Make sure it\'s located in /src/config')
    exit(1)
  }
}