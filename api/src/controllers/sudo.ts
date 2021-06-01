import { Request, Response } from 'express'
import logger from '../logger'
import User from '../models/User'
import { deleteUser, getModerators, newUser, setModerator } from '../mongo/userMethods'

export async function getModeratorsList(req: Request, res: Response) {
  const mods = await getModerators()
  res.status(200).json(JSON.parse(JSON.stringify(mods)))
}

export async function addModerator(req: Request, res: Response) {
  try {
    const newMod = await newUser(req.body.username, req.body.email, req.body.password)
    await setModerator(newMod)
    res.status(200).json({ message: 'New moderator account create successfully' })
  } catch (err) {
    logger.error(err)
    res.status(500).json({ error: true, message: 'An error has occurred' })
  }
}

export async function removeUser(req: Request, res: Response) {
  try {
    const staff: User = req.body['user']
    const result = await deleteUser(staff.username, req.params.username)
    if (result) return res.status(200).json({ message: 'User deletion completed' })
  } catch (err) {
    logger.error(err)
  }
  return res.status(500).json({ error: true, message: 'Unable to delete user' })
}