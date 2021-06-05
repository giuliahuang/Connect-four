import dotenv from 'dotenv'
import { exit } from 'process'
import logger from '../logger/'
import path from 'path'

export function setupEnv() {
  if (dotenv.config({ path: path.join(__dirname, '../../.env') }).error) {
    logger.error('No .env file detected')
    exit(1)
  }
}