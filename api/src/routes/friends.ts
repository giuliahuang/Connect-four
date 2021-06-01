import express from 'express'
import { addFriend, deleteFriend, getFriendsList, getFriendsRequests, respondFriendRequest } from '../controllers/friends'

const router = express.Router()

router.get('/', getFriendsList)
router.post('/', express.urlencoded({ extended: true }), express.json(), addFriend)
router.delete('/:username', deleteFriend)

router.get('/friendrequests', getFriendsRequests)
router.post('/friendrequests', express.urlencoded({ extended: true }), express.json(), respondFriendRequest)

export default router