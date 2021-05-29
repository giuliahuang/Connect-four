import { Router } from 'express'
import { getRanking } from '../controllers/ranking'

const router = Router()

router.get('/', getRanking)

export default router