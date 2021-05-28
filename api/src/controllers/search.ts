import { Request, Response } from 'express'
import { getUsersByUsername } from '../mongo/user'

export async function search(req: Request, res: Response) {
  const uname = req.body.username
  const docs = getUsersByUsername(uname)
  const jsonObj = JSON.parse(JSON.stringify(docs))
  res.status(200).json(jsonObj)
}