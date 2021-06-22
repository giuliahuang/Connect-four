import cors from 'cors'
import express, { json, urlencoded } from 'express'
import corsOptions from '../config/cors'
import upload from '../config/multer'
import { friendProfile } from '../controllers/friends'
import { getUserProfile, uploadAvatar } from '../controllers/userProfile'

const router = express.Router()

router.get('/', getUserProfile)

router.get('/:username', friendProfile)

router.put('/avatar', cors(corsOptions), urlencoded({ extended: true }), json(), upload.single('data'), uploadAvatar)

export default router