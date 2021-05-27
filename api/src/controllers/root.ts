import { Request, Response, NextFunction } from 'express'

const welcome = (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: 'Welcome to Connect Four' })
}

export default { welcome }
