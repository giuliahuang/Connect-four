import express from 'express'
import controller from '../controllers/matchmaker'
const router = express.Router()

router.get('/', controller.matchmake)

export = router
