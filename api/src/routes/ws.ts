import { Router } from 'express'
import { ws1, ws2 } from '../controllers/ws'

const router = Router()

router.get('/p1', ws1)
router.get('/p2', ws2)

export default router