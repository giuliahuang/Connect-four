import { Request, Response, NextFunction } from 'express'

var path = require('path')
const welcome = (req: Request, res: Response, next: NextFunction) => {
  // return res.status(200).json({ message: 'Welcome to Connect Four' })
  // return res.sendFile('/Users/giulia_huang/Desktop/connect-four/api/src/controllers/index.html')
  return res.sendFile('/workplace/api/src/controllers/index.html')
}

export default { welcome }
