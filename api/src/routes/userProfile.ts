import { getUserProfile } from '../controllers/userProfile'
import { Router } from 'express'

const router = Router()

router.get('/profile', getUserProfile)

export default router