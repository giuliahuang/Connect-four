import { Request, Response, NextFunction } from 'express'

const welcome = (req: Request, res: Response, next: NextFunction) => {
  // return res.status(200).json({ message: 'Welcome to Connect Four' })
  return res.sendFile('/workspace/api/src/controllers/index.html')
}

export default { welcome }
