import express from 'express'
import { addFriend, deleteFriend, getFriends, getFriendsRequests, respondFriendRequest } from '../controllers/friends'

const router = express.Router()

router.post('/', express.urlencoded({ extended: true }), express.json(), addFriend)
router.delete('/:username', deleteFriend)

router.get('/friendrequests', getFriendsRequests)
router.get('/friends', getFriends)
router.post('/friendrequests', express.urlencoded({ extended: true }), express.json(), respondFriendRequest)

export default router