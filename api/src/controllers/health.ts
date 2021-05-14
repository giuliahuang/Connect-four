import { Request, Response, NextFunction } from 'express'
import logger from '../logger/logger'

const NAMESPACE = 'Sample Controller'

const healthCheck = (req: Request, res: Response, next: NextFunction) => {
  logger.info(NAMESPACE, 'Health check route')
  return res.status(200).json({ message: 'API is up and running' })
}

export default { healthCheck }
