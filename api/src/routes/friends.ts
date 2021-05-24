import express from 'express'
import { getFriendsList } from '../controllers/friends'
const router = express.Router()

router.get('/', getFriendsList)

export = router
