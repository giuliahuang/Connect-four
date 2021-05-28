import express from 'express'
import { friendsRequestsHandler, deleteFriend, getFriendsList, getFriendsRequests } from '../controllers/friends'
import router from './auth'

router.get('/friends', getFriendsList)
router.delete('/friends', express.urlencoded({ extended: true }), express.json(), deleteFriend)

router.get('/friends/friendrequests', getFriendsRequests)
router.post('/friends/friendrequests', express.urlencoded({ extended: true }), express.json(), friendsRequestsHandler)
