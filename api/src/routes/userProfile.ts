import { getAvatar, getUserProfile, uploadAvatar } from '../controllers/userProfile'
import { Router, urlencoded, json } from 'express'
import upload from '../config/multer'
import cors from 'cors'

const router = Router()

const corsImages = {
  origin: function (origin, callback) {
    callback(null, true)
  },
  methods: 'GET'
}

router.get('/profile', getUserProfile)

router.get('/profile/avatar', getAvatar)

router.put('/profile/avatar', cors(corsImages), urlencoded({ extended: true }), json(), upload.single('data'), uploadAvatar)

export default router