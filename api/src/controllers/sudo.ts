import { Request, Response } from 'express'
import logger from '../logger'
import User from '../models/User'
import { deleteUser, getModerators, newUser, setModerator } from '../mongo/userMethods'

export async function getModeratorsList(_req: Request, res: Response): Promise<void> {
  const mods = await getModerators()
  res.status(200).json(JSON.parse(JSON.stringify(mods)))
}

export async function addModerator(req: Request, res: Response): Promise<void> {
  try {
    const newMod = await newUser(req.body.username, req.body.email, req.body.password)
    await setModerator(newMod.email)
    res.status(200).json({ message: 'New moderator account create successfully' })
  } catch (err) {
    logger.error(err)
    res.status(500).json({ error: true, message: 'An error has occurred' })
  }
}

export async function removeUser(req: Request, res: Response): Promise<void> {
  try {
    const staff: User = req.user as User
    const result = await deleteUser(staff.username, req.params.username)
    if (result) res.status(200).json({ message: 'User deletion completed' })
    else res.status(500).json({ error: true, message: 'Unable to delete user' })
  } catch (err) {
    logger.error(err)
    res.status(500).json({ error: true, message: 'Unable to delete user' })
  }
}