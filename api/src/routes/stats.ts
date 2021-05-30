import { getUserStats } from '../controllers/userStats'
import { Router } from 'express'

const router = Router()

router.get('/stats', getUserStats)

export default router