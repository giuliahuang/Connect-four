import { Request, Response, NextFunction } from 'express'
import { setPassword, newUser, User } from '../models/User'

export async function signup(req: Request, res: Response, next: NextFunction) {
  if (!req.body.password) {
    console.log('memes');
    return next({ statusCode: 404, error: true, errormessage: "Password field missing" })
  }
  
  const u: User = {
    username: req.body.username,
    mail: req.body.mail,
    salt: '',
    digest: '',
    roles: []
  }
  
  try {
    const user = await newUser(u)
    await setPassword(user, req.body.password)
  } catch (err) {
    if (err.code === 11000)
      return next({ statusCode: 404, error: true, errormessage: "User already exists" })
    return next({ statusCode: 404, error: true, errormessage: "DB error: " + err.errmsg })
  }

  return res.status(200).json({ message: 'Success' })
}