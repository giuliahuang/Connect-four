import { Router } from 'express'
import passport from 'passport'
import { addFriend, getFriendsList, deleteFriend } from '../controllers/friends'
import express from 'express'

const router = Router()
router.use(passport.authenticate('jwt', { session: false }))

router.get('/friends', getFriendsList)

router.post('/friends', express.urlencoded({ extended: true }), express.json(), addFriend)

router.delete('/friends', express.urlencoded({ extended: true }), express.json(), deleteFriend)

export default router