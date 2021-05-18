import { Request, Response, NextFunction } from 'express'

const matchmake = (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: 'API is up and running' })
}

export default { matchmake }
