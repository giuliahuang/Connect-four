import { Request, Response } from 'express'
import User from '../models/User'
import { deleteUserSudo, getModerators, newUser, setModerator } from '../mongo/userMethods'

// These controllers assume that the request originated from a user with enough
// privileges thanks to the middleware loaded into the associated router

/**
 * Returns the list of all moderators
 * @param _req Request
 * @param res Response
 */
export async function getModeratorsList(_req: Request, res: Response): Promise<void> {
  const mods = await getModerators()
  res.status(200).json(JSON.parse(JSON.stringify(mods)))
}

/**
 * Creates a new moderator account through the parameters username, email and password
 * set into the request's body
 * @param req Request
 * @param res Response
 */
export async function addModerator(req: Request, res: Response): Promise<void> {
  const newMod = await newUser(req.body.username, req.body.email, req.body.password)
  if (newMod) {
    await setModerator(newMod.email)
    res.status(200).json({ message: 'New moderator account create successfully' })
  } else {
    res.status(500).json({ error: true, message: 'An error has occurred' })
  }
}

/**
 * Removes a user from the database, respecting the roles hierarchy
 * @param req Request
 * @param res Response
 */
export async function removeUser(req: Request, res: Response): Promise<void> {
  const staff: User = req.user as User
  const result = await deleteUserSudo(staff.username, req.params.username)
  if (result) res.status(200).json({ message: 'User deletion completed' })
  else res.status(500).json({ error: true, message: 'Unable to delete user' })
}