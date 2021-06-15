import express, { Router } from 'express'
import { addModerator, getModeratorsList, removeUser } from '../controllers/sudo'
import staffChecker from '../server/middleware/staffChecker'

const router = Router()

router.use(staffChecker)

router.get('/mods', getModeratorsList)

router.put('/mods', express.urlencoded({ extended: true }), express.json(), addModerator)

router.delete('/users/:username', removeUser)

export default router